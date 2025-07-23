import { Station } from "../models/Station";

export const stationService = {
  createStation: async (stationData: {
    name: string;
    code: string;
    address?: string;
    status?: string;
  }) => {
    const station = await Station.create(stationData);
    return station;
  },

  getAllStations: async () => {
    const stations = await Station.find().lean();
    return stations;
  },

  getStationNamesAndCities: async () => {
    // Chỉ lấy name và address.city
    const stations = await Station.find(
      {},
      { name: 1, "address.city": 1, _id: 1 }
    ).lean();
    return stations;
  },

  getStationById: async (stationId: string) => {
    const station = await Station.findById(stationId);
    if (!station) {
      throw new Error("Station not found");
    }
    return station;
  },

  updateStation: async (
    stationId: string,
    updateData: {
      name?: string;
      code?: string;
      address?: string;
      status?: string;
    }
  ) => {
    const station = await Station.findByIdAndUpdate(stationId, updateData, {
      new: true,
    });
    if (!station) {
      throw new Error("Station not found");
    }
    return station;
  },

  deleteStation: async (stationId: string) => {
    const station = await Station.findById(stationId);
    if (!station) {
      throw new Error("Station not found");
    }
    if (station.status !== "inactive") {
      throw new Error("Only stations with status 'inactive' can be deleted");
    }
    // Kiểm tra còn route nào liên kết không
    const routeCount = await require("../models/Route").Route.countDocuments({
      $or: [
        { originStation: stationId },
        { destinationStation: stationId }
      ]
    });
    if (routeCount > 0) {
      throw new Error("Cannot delete station: there are routes linked to this station");
    }
    // Kiểm tra còn trip nào liên kết không (nếu có logic liên kết trực tiếp)
    // const tripCount = await require("../models/Trip").Trip.countDocuments({
    //   $or: [{ pickupStation: stationId }, { dropoffStation: stationId }]
    // });
    // if (tripCount > 0) {
    //   throw new Error("Cannot delete station: there are trips linked to this station");
    // }
    await Station.findByIdAndDelete(stationId);
    return station;
  },
};
