import { Trip } from "../models/Trip";
import { ITrip } from "../interfaces/ITrip";
import { Station } from "../models/Station";
import { Route } from "../models/Route";

export const tripService = {
  // Create a new trip
  createTrip: async (tripData: Partial<ITrip>) => {
    const trip = await Trip.create(tripData);
    return trip;
  },

  createMultipleTrips: async (
    tripData: Partial<ITrip>,
    startTime: string,
    endTime: string,
    intervalHours: number = 2
  ) => {
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

      // arrivalTime = departureTime + intervalHours
      let arrivalHour = currentHour + intervalHours;
      let arrivalMinute = currentMinute;
      if (arrivalHour >= 24) arrivalHour -= 24; // Đảm bảo không vượt quá 24h

      const arrivalTime = `${arrivalHour
        .toString()
        .padStart(2, "0")}:${arrivalMinute.toString().padStart(2, "0")}`;

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
    const trips = await Trip.find().populate("route").populate("bus");
    return trips;
  },

  // Get a single trip by ID
  getTripById: async (tripId: string) => {
    const trip = await Trip.findById(tripId).populate("route").populate("bus");
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
      .populate("bus");

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
