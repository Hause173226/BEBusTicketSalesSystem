import { Request, Response } from "express";
import { tripService } from "../services/tripService";

export const createTrip = async (req: Request, res: Response) => {
  try {
    const trip = await tripService.createTrip(req.body);
    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createMultipleTrips = async (req: Request, res: Response) => {
  console.log("1");

  try {
    const { tripData, startTime, endTime, intervalHours } = req.body;
    console.log("2", tripData, startTime, endTime, intervalHours);

    if (!tripData || !startTime || !endTime) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    const trips = await tripService.createMultipleTrips(
      tripData,
      startTime,
      endTime,
      intervalHours || 2
    );
    console.log("3", trips);

    res.status(201).json(trips);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllTrips = async (req: Request, res: Response) => {
  try {
    const trips = await tripService.getAllTrips();
    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTripById = async (req: Request, res: Response) => {
  try {
    const tripId = req.params.id;
    const trip = await tripService.getTripById(tripId);
    res.status(200).json(trip);
  } catch (err) {
    if (err instanceof Error && err.message === "Trip not found") {
      res.status(404).json({ error: "Trip not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const updateTrip = async (req: Request, res: Response) => {
  try {
    const tripId = req.params.id;
    const trip = await tripService.updateTrip(tripId, req.body);
    res.status(200).json(trip);
  } catch (err) {
    if (err instanceof Error && err.message === "Trip not found") {
      res.status(404).json({ error: "Trip not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const deleteTrip = async (req: Request, res: Response) => {
  try {
    const tripId = req.params.id;
    const trip = await tripService.deleteTrip(tripId);
    res.status(200).json(trip);
  } catch (err) {
    if (err instanceof Error && err.message === "Trip not found") {
      res.status(404).json({ error: "Trip not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const searchTrips = async (req: Request, res: Response) => {
  try {
    const { from, to, date, searchBy } = req.query;

    if (!from || !to || !date || !searchBy) {
      res.status(400).json({ error: "Missing required query parameters" });
      return;
    }

    // searchBy phải là "city" hoặc "station"
    if (searchBy !== "city" && searchBy !== "station") {
      res.status(400).json({ error: "searchBy must be 'city' or 'station'" });
      return;
    }

    const trips = await tripService.searchTrips(
      from as string,
      to as string,
      date as string,
      searchBy as "city" | "station"
    );
    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
