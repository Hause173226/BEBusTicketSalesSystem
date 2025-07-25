import { Request, Response } from "express";
import { stationService } from "../services/stationService";

export const createStation = async (req: Request, res: Response) => {
  try {
    const station = await stationService.createStation(req.body);
    res.status(201).json(station);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  }
};

export const getAllStations = async (req: Request, res: Response) => {
  try {
    const stations = await stationService.getAllStations();
    res.status(200).json(stations);
  } catch (err) {
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};

export const getStationNamesAndCities = async (req: Request, res: Response) => {
  try {
    const stations = await stationService.getStationNamesAndCities();
    res.json(stations);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getStationById = async (req: Request, res: Response) => {
  try {
    const stationId = req.params.id;
    const station = await stationService.getStationById(stationId);
    res.status(200).json(station);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "Station not found") {
        res.status(404).json({ error: "Không tìm thấy bến xe" });
      } else {
        res.status(400).json({ error: err.message });
      }
    } else {
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  }
};

export const updateStation = async (req: Request, res: Response) => {
  try {
    const stationId = req.params.id;
    const station = await stationService.updateStation(stationId, req.body);
    res.status(200).json(station);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "Station not found") {
        res.status(404).json({ error: "Không tìm thấy bến xe" });
      } else {
        res.status(400).json({ error: err.message });
      }
    } else {
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  }
};

export const deleteStation = async (req: Request, res: Response) => {
  try {
    const stationId = req.params.id;
    const station = await stationService.deleteStation(stationId);
    res.status(200).json(station);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "Station not found") {
        res.status(404).json({ error: "Không tìm thấy bến xe" });
      } else {
        res.status(400).json({ error: err.message });
      }
    } else {
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  }
};
