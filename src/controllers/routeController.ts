import { Request, Response } from "express";
import { routeService } from "../services/routeService";

export const createRoute = async (req: Request, res: Response) => {
  try {
    const route = await routeService.createRoute(req.body);
    res.status(201).json(route);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllRoutes = async (req: Request, res: Response) => {
  try {
    const routes = await routeService.getAllRoutes();
    res.status(200).json(routes);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getRouteById = async (req: Request, res: Response) => {
  try {
    const routeId = req.params.id;
    const route = await routeService.getRouteById(routeId);
    res.status(200).json(route);
  } catch (err) {
    if (err instanceof Error && err.message === "Route not found") {
      res.status(404).json({ error: "Route not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const updateRoute = async (req: Request, res: Response) => {
  try {
    const routeId = req.params.id;
    const route = await routeService.updateRoute(routeId, req.body);
    res.status(200).json(route);
  } catch (err) {
    if (err instanceof Error && err.message === "Route not found") {
      res.status(404).json({ error: "Route not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const deleteRoute = async (req: Request, res: Response) => {
  try {
    const routeId = req.params.id;
    const route = await routeService.deleteRoute(routeId);
    res.status(200).json(route);
  } catch (err) {
    if (err instanceof Error && err.message === "Route not found") {
      res.status(404).json({ error: "Route not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
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
        error: "Both startLocationId and endLocationId are required"        
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