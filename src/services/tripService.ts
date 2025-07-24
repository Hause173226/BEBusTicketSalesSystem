import { Trip } from "../models/Trip";
import { ITrip } from "../interfaces/ITrip";
import { Station } from "../models/Station";
import { Route } from "../models/Route";
import { Bus } from "../models/Bus";
import { SeatBookingService } from "./seatBookingService";
import { Driver } from "../models/Driver";

export const tripService = {
  // Create a new trip
  createTrip: async (tripData: Partial<ITrip>) => {
    // Validate required fields
    if (!tripData.bus) throw new Error("Bus ID is required");
    if (!tripData.route) throw new Error("Route ID is required");
    if (!tripData.driver) throw new Error("Driver ID is required");
    if (!tripData.departureDate || !tripData.departureTime)
      throw new Error("Departure date and time are required");

    // Kiểm tra bus, route, driver có tồn tại và active
    const bus = await Bus.findById(tripData.bus);
    if (!bus) throw new Error("Bus not found");
    if (bus.status !== "active")
      throw new Error(`Bus ${bus.licensePlate} is not active.`);

    const route = await Route.findById(tripData.route);
    if (!route) throw new Error("Route not found");
    if (route.status !== "active")
      throw new Error(`Route ${route.name} is not active.`);
    if (typeof route.estimatedDuration !== "number")
      throw new Error("Route missing estimatedDuration");

    const driver = await Driver.findById(tripData.driver);
    if (!driver) throw new Error("Driver not found");
    if (driver.status !== "active")
      throw new Error(`Driver ${driver.fullName} is not active.`);

    // Chuẩn hóa departureDate về kiểu Date (dù FE gửi kiểu nào)
    let tripDate: Date;
    if (typeof tripData.departureDate === "string") {
      tripDate = new Date(tripData.departureDate);
    } else {
      tripDate = tripData.departureDate as Date;
    }

    // Tạo đối tượng thời gian khởi hành đầy đủ
    const [depHour, depMinute] = tripData.departureTime.split(":").map(Number);
    tripDate.setHours(depHour, depMinute, 0, 0);
    const tripDateTime = tripDate;

    // Kiểm tra không tạo chuyến trong quá khứ
    const now = new Date();
    if (tripDateTime <= now) {
      throw new Error("Cannot create trip in the past.");
    }

    // Tính thời gian kết thúc chuyến mới
    const newStart = tripDateTime;
    const newEnd = new Date(
      newStart.getTime() + route.estimatedDuration * 60000
    );

    // Kiểm tra trùng lịch xe/tài xế
    const conflictTrips = await Trip.find({
      $or: [{ bus: tripData.bus }, { driver: tripData.driver }],
      status: { $in: ["scheduled", "in_progress"] },
    }).populate("route");

    for (const trip of conflictTrips) {
      // Chuẩn hóa departureDate của trip cũ
      let oldTripDate: Date;
      if (typeof trip.departureDate === "string") {
        oldTripDate = new Date(trip.departureDate);
      } else {
        oldTripDate = trip.departureDate as Date;
      }
      const [oldDepHour, oldDepMinute] = trip.departureTime
        .split(":")
        .map(Number);
      oldTripDate.setHours(oldDepHour, oldDepMinute, 0, 0);
      const tripStart = oldTripDate;

      // Lấy estimatedDuration từ route đã populate
      const routeData = trip.route as any;
      const tripEnd = new Date(
        tripStart.getTime() + (routeData.estimatedDuration || 0) * 60000
      );

      // Nếu thời gian mới giao với thời gian cũ
      if (newStart < tripEnd && newEnd > tripStart) {
        throw new Error(
          "Bus or driver is already scheduled for another trip during this time."
        );
      }
    }

    // Tính arrivalTime tự động từ departureTime và estimatedDuration
    const totalMinutes = depHour * 60 + depMinute + route.estimatedDuration;
    const arrHour = Math.floor((totalMinutes % 1440) / 60);
    const arrMinute = totalMinutes % 60;
    const arrivalTime = `${arrHour.toString().padStart(2, "0")}:${arrMinute
      .toString()
      .padStart(2, "0")}`;

    // Tạo trip
    const trip = await Trip.create({
      ...tripData,
      departureDate: tripDateTime, // Lưu lại kiểu Date chuẩn
      arrivalTime, // Tính tự động
      availableSeats: bus.seatCount || 40,
    });

    // Tạo SeatBooking cho trip mới
    try {
      await SeatBookingService.initSeatsForTrip(
        trip._id.toString(),
        tripData.bus.toString()
      );
    } catch (seatError: any) {
      console.error(
        `Failed to initialize seats for trip ${trip._id}:`,
        seatError.message
      );
    }

    return trip;
  },

  createMultipleTrips: async (
    tripData: Partial<ITrip>,
    startTime: string,
    endTime: string,
    intervalHours: number = 2
  ) => {
    // Lấy thông tin route để lấy estimatedDuration
    const route = await Route.findById(tripData.route);
    if (!route) throw new Error("Route not found");
    if (typeof route.estimatedDuration !== "number")
      throw new Error("Route missing estimatedDuration");

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const trips = [];
    let currentHour = startHour;
    let currentMinute = startMinute;

    // Tạo các chuyến cho đến khi departureTime vượt quá endTime
    while (currentHour < endHour) {
      // departureTime
      const departureTime = `${currentHour
        .toString()
        .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

      // Sinh tripCode: TRIP + 4 số random
      const tripCode = `TRIP${Math.floor(1000 + Math.random() * 9000)}`;

      // arrivalTime = departureTime + estimatedDuration
      const totalMinutes =
        currentHour * 60 + currentMinute + route.estimatedDuration;
      const arrHour = Math.floor((totalMinutes % 1440) / 60);
      const arrMinute = totalMinutes % 60;
      const arrivalTime = `${arrHour.toString().padStart(2, "0")}:${arrMinute
        .toString()
        .padStart(2, "0")}`;

      const newTrip = await Trip.create({
        ...tripData,
        departureTime,
        arrivalTime,
        tripCode,
      });
      trips.push(newTrip);

      currentHour += intervalHours;
    }

    return trips;
  },

  // Get all trips with optional population of related fields
  getAllTrips: async () => {
    const trips = await Trip.find()
      .populate({
        path: "route",
        populate: [
          { path: "originStation", model: "Station" },
          { path: "destinationStation", model: "Station" },
        ],
      })
      .populate("bus")
      .populate("driver");
    return trips;
  },

  // Get a single trip by ID
  getTripById: async (tripId: string) => {
    const trip = await Trip.findById(tripId)
      .populate({
        path: "route",
        populate: [
          { path: "originStation", model: "Station" },
          { path: "destinationStation", model: "Station" },
        ],
      })
      .populate("bus")
      .populate("driver");
    if (!trip) {
      throw new Error("Trip not found");
    }
    return trip;
  },

  // Update a trip
  updateTrip: async (tripId: string, updateData: Partial<ITrip>) => {
    const trip = await Trip.findByIdAndUpdate(tripId, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("route")
      .populate("bus")
      .populate("driver");

    if (!trip) {
      throw new Error("Trip not found");
    }
    return trip;
  },

  // Delete a trip
  deleteTrip: async (tripId: string) => {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      throw new Error("Trip not found");
    }
    if (trip.status !== "cancelled" && trip.status !== "completed") {
      throw new Error(
        "Only trips with status 'cancelled' or 'completed' can be deleted"
      );
    }
    await Trip.findByIdAndDelete(tripId);
    return trip;
  },

  searchTrips: async (
    from: string,
    to: string,
    date: string,
    searchBy: "city" | "station" // searchBy: "city" nếu truyền tỉnh/thành, "station" nếu truyền tên bến xe
  ) => {
    let originStations, destinationStations;

    if (searchBy === "city") {
      // Tìm tất cả bến xe thuộc tỉnh/thành phố
      originStations = await Station.find({ "address.city": from });
      destinationStations = await Station.find({ "address.city": to });
    } else {
      // Tìm theo tên bến xe
      originStations = await Station.find({ name: from });
      destinationStations = await Station.find({ name: to });
    }

    if (!originStations.length || !destinationStations.length) return [];

    const originIds = originStations.map((s) => s._id);
    const destinationIds = destinationStations.map((s) => s._id);

    const routes = await Route.find({
      originStation: { $in: originIds },
      destinationStation: { $in: destinationIds },
      status: "active",
    });

    if (!routes.length) return [];

    const routeIds = routes.map((r) => r._id);
    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const trips = await Trip.find({
      route: { $in: routeIds },
      departureDate: { $gte: start, $lte: end },
      status: "scheduled",
    })
      .populate({
        path: "route",
        populate: [
          { path: "originStation", model: "Station" },
          { path: "destinationStation", model: "Station" },
        ],
      })
      .populate("bus");

    return trips;
  },

  getTripsbyRouteId: async (routeId: string) => {
    // Kiểm tra route có tồn tại không
    const route = await Route.findById(routeId);
    if (!route) {
      throw new Error("Route not found");
    }

    // Lấy tất cả trip thuộc route này
    const trips = await Trip.find({ route: routeId })
      .populate({
        path: "route",
        populate: [
          { path: "originStation", model: "Station" },
          { path: "destinationStation", model: "Station" },
        ],
      })
      .populate("bus")
      .populate("driver")
      .sort({ departureDate: 1, departureTime: 1 }); // Sắp xếp theo ngày và giờ khởi hành

    return trips;
  },

  // Update trip status with strict flow
  updateTripStatus: async (tripId: string, newStatus: string) => {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      throw new Error("Trip not found");
    }
    const currentStatus = trip.status as
      | "scheduled"
      | "in_progress"
      | "completed"
      | "cancelled";
    // Allowed transitions
    const allowedTransitions: Record<
      "scheduled" | "in_progress" | "completed" | "cancelled",
      string[]
    > = {
      scheduled: ["in_progress", "cancelled"],
      in_progress: ["completed", "cancelled"],
      completed: [],
      cancelled: [],
    };
    if (!allowedTransitions[currentStatus].includes(newStatus)) {
      throw new Error(
        `Cannot change status from '${currentStatus}' to '${newStatus}'. Allowed: ${allowedTransitions[
          currentStatus
        ].join(", ")}`
      );
    }
    // Thêm kiểm tra thời gian thực tế
    const now = new Date();
    const [depHour, depMinute] = trip.departureTime.split(":").map(Number);
    const depDate = new Date(trip.departureDate);
    depDate.setHours(depHour, depMinute, 0, 0);
    let arrDate: Date | null = null;
    if (trip.arrivalTime) {
      const [arrHour, arrMinute] = trip.arrivalTime.split(":").map(Number);
      arrDate = new Date(trip.departureDate);
      arrDate.setHours(arrHour, arrMinute, 0, 0);
      if (arrHour < depHour || (arrHour === depHour && arrMinute < depMinute)) {
        arrDate.setDate(arrDate.getDate() + 1);
      }
    }
    if (newStatus === "in_progress" && now < depDate) {
      throw new Error("Chưa đến giờ khởi hành, không thể chuyển sang trạng thái 'Đang chạy'.");
    }
    if (newStatus === "completed" && arrDate && now < arrDate) {
      throw new Error("Chưa đến giờ đến, không thể chuyển sang trạng thái 'Hoàn thành'.");
    }
    trip.status = newStatus as
      | "scheduled"
      | "in_progress"
      | "completed"
      | "cancelled";
    await trip.save();
    return trip;
  },
};
