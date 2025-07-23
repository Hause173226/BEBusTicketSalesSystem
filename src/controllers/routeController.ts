import { Request, Response } from "express";
import { routeService } from "../services/routeService";

export const createRoute = async (req: Request, res: Response) => {
  try {
    const route = await routeService.createRoute(req.body);
    res.status(201).json(route);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "Route with the same origin and destination already exists") {
        res.status(409).json({ error: "Tuyến đường với điểm đi và đến này đã tồn tại" });
      } else {
        res.status(400).json({ error: err.message });
      }
    } else {
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  }
};

export const getAllRoutes = async (req: Request, res: Response) => {
  try {
    const routes = await routeService.getAllRoutes();
    res.status(200).json(routes);
  } catch (err) {
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};

export const getRouteById = async (req: Request, res: Response) => {
  try {
    const routeId = req.params.id;
    const route = await routeService.getRouteById(routeId);
    res.status(200).json(route);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "Route not found") {
        res.status(404).json({ error: "Không tìm thấy tuyến đường" });
      } else {
        res.status(400).json({ error: err.message });
      }
    } else {
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  }
};

export const updateRoute = async (req: Request, res: Response) => {
  try {
    const routeId = req.params.id;
    const route = await routeService.updateRoute(routeId, req.body);
    res.status(200).json(route);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "Route not found") {
        res.status(404).json({ error: "Không tìm thấy tuyến đường" });
      } else {
        res.status(400).json({ error: err.message });
      }
    } else {
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  }
};

export const deleteRoute = async (req: Request, res: Response) => {
  try {
    const routeId = req.params.id;
    const route = await routeService.deleteRoute(routeId);
    res.status(200).json(route);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "Route not found") {
        res.status(404).json({ error: "Không tìm thấy tuyến đường" });
      } else {
        res.status(400).json({ error: err.message });
      }
    } else {
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  }
};

// Additional utility endpoints
export const getRoutesByLocation = async (req: Request, res: Response) => {
  try {
    const locationId = req.params.locationId;
    const routes = await routeService.getRoutesByLocation(locationId);
    res.status(200).json(routes);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchRoutes = async (req: Request, res: Response) => {
  try {
    const { startLocationId, endLocationId } = req.query;
    if (!startLocationId || !endLocationId) {
      res.status(400).json({
        error: "Both startLocationId and endLocationId are required",
      });
      return;
    }
    const routes = await routeService.searchRoutes(
      startLocationId as string,
      endLocationId as string
    );
    res.status(200).json(routes);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
