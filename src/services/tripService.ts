import { Trip } from "../models/Trip";
import { ITrip } from "../interfaces/ITrip";
import { Station } from "../models/Station";
import { Route } from "../models/Route";
import { Bus } from "../models/Bus";
import { SeatBookingService } from "./seatBookingService";

export const tripService = {
  // Create a new trip
  createTrip: async (tripData: Partial<ITrip>) => {
    // Validate required fields
    if (!tripData.bus) {
      throw new Error("Bus ID is required");
    }

    if (!tripData.route) {
      throw new Error("Route ID is required");
    }

    // Kiểm tra bus có tồn tại và có hoạt động không
    const bus = await Bus.findById(tripData.bus);
    if (!bus) {
      throw new Error("Bus not found");
    }

    if (bus.status !== "active") {
      throw new Error(
        `Cannot create trip. Bus ${bus.licensePlate} is not active. Current status: ${bus.status}`
      );
    }

    // Kiểm tra route có tồn tại và có hoạt động không
    const route = await Route.findById(tripData.route);
    if (!route) {
      throw new Error("Route not found");
    }

    if (route.status !== "active") {
      throw new Error(
        `Cannot create trip. Route ${route.name} is not active. Current status: ${route.status}`
      );
    }

    // Kiểm tra bus có đang được sử dụng trong cùng thời gian không
    if (tripData.departureDate && tripData.departureTime) {
      const existingTrip = await Trip.findOne({
        bus: tripData.bus,
        departureDate: tripData.departureDate,
        departureTime: tripData.departureTime,
        status: { $in: ["scheduled", "in_progress"] },
      });

      if (existingTrip) {
        throw new Error(
          `Bus ${bus.licensePlate} is already scheduled for another trip at ${tripData.departureTime} on ${tripData.departureDate}`
        );
      }
    }

    // Tạo trip nếu tất cả kiểm tra đều pass
    const trip = await Trip.create(tripData);

    // Tự động tạo SeatBooking cho trip mới
    try {
      await SeatBookingService.initSeatsForTrip(
        trip._id.toString(),
        tripData.bus.toString()
      );
      console.log(`SeatBooking initialized for trip: ${trip._id}`);
    } catch (seatError: any) {
      console.error(
        `Failed to initialize seats for trip ${trip._id}:`,
        seatError.message
      );
      // Không throw error để không ảnh hưởng đến việc tạo trip
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
    const trip = await Trip.findByIdAndDelete(tripId);
    if (!trip) {
      throw new Error("Trip not found");
    }
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
};
