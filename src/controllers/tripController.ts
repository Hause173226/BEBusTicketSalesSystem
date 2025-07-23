import { Request, Response } from "express";
import { tripService } from "../services/tripService";

export const createTrip = async (req: Request, res: Response) => {
  try {
    const trip = await tripService.createTrip(req.body);
    res.status(201).json(trip);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes("not found")) {
        res.status(404).json({ error: "Không tìm thấy dữ liệu" });
      } else {
        res.status(400).json({ error: err.message });
      }
    } else {
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  }
};

export const createMultipleTrips = async (req: Request, res: Response) => {
  try {
    const { tripData, startTime, endTime, intervalHours } = req.body;
    if (!tripData || !startTime || !endTime) {
      res.status(400).json({ error: "Thiếu trường bắt buộc" });
      return;
    }
    const trips = await tripService.createMultipleTrips(
      tripData,
      startTime,
      endTime,
      intervalHours || 2
    );
    res.status(201).json(trips);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes("not found")) {
        res.status(404).json({ error: "Không tìm thấy dữ liệu" });
      } else {
        res.status(400).json({ error: err.message });
      }
    } else {
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  }
};

export const getAllTrips = async (req: Request, res: Response) => {
  try {
    const trips = await tripService.getAllTrips();
    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};

export const getTripById = async (req: Request, res: Response) => {
  try {
    const tripId = req.params.id;
    const trip = await tripService.getTripById(tripId);
    res.status(200).json(trip);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "Trip not found") {
        res.status(404).json({ error: "Không tìm thấy chuyến đi" });
      } else {
        res.status(400).json({ error: err.message });
      }
    } else {
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  }
};

export const updateTrip = async (req: Request, res: Response) => {
  try {
    const tripId = req.params.id;
    const trip = await tripService.updateTrip(tripId, req.body);
    res.status(200).json(trip);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "Trip not found") {
        res.status(404).json({ error: "Không tìm thấy chuyến đi" });
      } else {
        res.status(400).json({ error: err.message });
      }
    } else {
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  }
};

export const deleteTrip = async (req: Request, res: Response) => {
  try {
    const tripId = req.params.id;
    const trip = await tripService.deleteTrip(tripId);
    res.status(200).json(trip);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "Trip not found") {
        res.status(404).json({ error: "Không tìm thấy chuyến đi" });
      } else {
        res.status(400).json({ error: err.message });
      }
    } else {
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  }
};

export const searchTrips = async (req: Request, res: Response) => {
  try {
    const { from, to, date, searchBy } = req.query;
    if (!from || !to || !date || !searchBy) {
      res.status(400).json({ error: "Thiếu tham số truy vấn bắt buộc" });
      return;
    }
    if (searchBy !== "city" && searchBy !== "station") {
      res.status(400).json({ error: "searchBy phải là 'city' hoặc 'station'" });
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
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  }
};

export const getTripsbyRouteId = async (req: Request, res: Response) => {
  try {
    const { routeId } = req.params;
    if (!routeId) {
      res.status(400).json({
        success: false,
        message: "Thiếu Route ID",
      });
      return;
    }
    const trips = await tripService.getTripsbyRouteId(routeId);
    res.status(200).json({
      success: true,
      count: trips.length,
      data: trips,
    });
  } catch (error: any) {
    if (error instanceof Error && error.message === "Route not found") {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy tuyến đường",
      });
    } else {
      res.status(400).json({
        success: false,
        message: error.message || "Không lấy được chuyến đi theo tuyến",
      });
    }
  }
};

// PATCH /api/trips/:id/status
export const updateTripStatus = async (req: Request, res: Response) => {
  try {
    const tripId = req.params.id;
    const { status } = req.body;
    if (!status) {
      res.status(400).json({ error: "Thiếu trạng thái trong body" });
      return;
    }
    const trip = await tripService.updateTripStatus(tripId, status);
    res.status(200).json(trip);
  } catch (err: any) {
    if (err instanceof Error && err.message === "Trip not found") {
      res.status(404).json({ error: "Không tìm thấy chuyến đi" });
    } else {
      res.status(400).json({ error: err.message || "Chuyển trạng thái không hợp lệ" });
    }
  }
};
