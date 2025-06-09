import { Trip } from "../models/Trip";
import { ITrip } from "../interfaces/ITrip";

export const tripService = {
  // Create a new trip
  createTrip: async (tripData: Partial<ITrip>) => {
    const trip = await Trip.create(tripData);
    return trip;
  },

  // Get all trips with optional population of related fields
  getAllTrips: async () => {

    const trips = await Trip.find()
        .populate('route')  
        .populate('bus')
      .lean();

    return trips;
  },

  // Get a single trip by ID
  getTripById: async (tripId: string) => {
    const trip = await Trip.findById(tripId)
      .populate('route')
      .populate('bus');
    if (!trip) {
      throw new Error("Trip not found");
    }
    return trip;
  },

  // Update a trip
  updateTrip: async (tripId: string, updateData: Partial<ITrip>) => {
    const trip = await Trip.findByIdAndUpdate(
      tripId,
      updateData,
      { new: true, runValidators: true }
    ).populate('route').populate('bus');
    
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

};