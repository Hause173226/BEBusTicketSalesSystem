import { Route } from "../models/Route";
import { IRoute } from "../interfaces/IRoute";

export const routeService = {
  // Create a new route
  createRoute: async (routeData: Partial<IRoute>) => {
    // Kiểm tra trùng tuyến
    const existed = await Route.findOne({
      originStation: routeData.originStation,
      destinationStation: routeData.destinationStation,
    });
    if (existed) {
      throw new Error("Route with the same origin and destination already exists");
    }
    const route = await Route.create(routeData);
    return route;
  },

  // Get all routes
  getAllRoutes: async () => {
    const routes = await Route.find()
      .populate("originStation")
      .populate("destinationStation")
      .lean();
    return routes;
  },

  // Get route by ID
  getRouteById: async (routeId: string) => {
    const route = await Route.findById(routeId);
    // .populate("originStation")
    // .populate("destinationStation");
    if (!route) {
      throw new Error("Route not found");
    }
    return route;
  },

  // Update route
  updateRoute: async (routeId: string, updateData: Partial<IRoute>) => {
    const route = await Route.findByIdAndUpdate(routeId, updateData, {
      new: true,
      runValidators: true,
    });
    //   .populate('startLocation')
    //   .populate('endLocation');

    if (!route) {
      throw new Error("Route not found");
    }
    return route;
  },

  // Delete route
  deleteRoute: async (routeId: string) => {
    const route = await Route.findById(routeId);
    if (!route) {
      throw new Error("Route not found");
    }
    if (route.status !== "inactive") {
      throw new Error("Only routes with status 'inactive' can be deleted");
    }
    // Kiểm tra còn trip nào liên kết không
    const tripCount = await require("../models/Trip").Trip.countDocuments({ route: routeId });
    if (tripCount > 0) {
      throw new Error("Cannot delete route: there are trips linked to this route");
    }
    await Route.findByIdAndDelete(routeId);
    return route;
  },

  // Additional useful methods
  getRoutesByLocation: async (locationId: string) => {
    const routes = await Route.find({
      $or: [{ startLocation: locationId }, { endLocation: locationId }],
    })
      .populate("startLocation")
      .populate("endLocation")
      .lean();
    return routes;
  },

  searchRoutes: async (startLocationId: string, endLocationId: string) => {
    const routes = await Route.find({
      startLocation: startLocationId,
      endLocation: endLocationId,
    })
      .populate("startLocation")
      .populate("endLocation")
      .lean();
    return routes;
  },
};
