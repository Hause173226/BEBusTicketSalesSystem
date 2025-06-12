import { Station } from "../models/Station";

export const stationService = {
  createStation: async (stationData: { name: string; code: string; address?: string; status?: string }) => {
    const station = await Station.create(stationData);
    return station;
  },

  getAllStations: async () => {
    const stations = await Station.find().lean();
    return stations;
  },

  getStationById: async (stationId: string) => {
    const station = await Station.findById(stationId);
    if (!station) {
      throw new Error("Station not found");
    }
    return station;
  },

  updateStation: async (stationId: string, updateData: { name?: string; code?: string; address?: string; status?: string }) => {
    const station = await Station.findByIdAndUpdate(stationId, updateData, { new: true });
    if (!station) {
      throw new Error("Station not found");
    }
    return station;
  },

  deleteStation: async (stationId: string) => {
    const station = await Station.findByIdAndDelete(stationId);
    if (!station) {
      throw new Error("Station not found");
    }
    return station;
  },
}; 