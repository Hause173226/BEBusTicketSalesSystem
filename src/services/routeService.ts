import { Route } from "../models/Route";
import { IRoute } from "../interfaces/IRoute";
import { Station } from "../models/Station";

export const routeService = {
  // Create a new route
  createRoute: async (routeData: Partial<IRoute>) => {
    // Kiểm tra trùng tuyến
    const existed = await Route.findOne({
      originStation: routeData.originStation,
      destinationStation: routeData.destinationStation,
    });
    if (existed) {
      throw new Error("Tuyến đường với điểm đi và điểm đến này đã tồn tại");
    }

    // Kiểm tra trạng thái của originStation
    const originStation = await Station.findById(routeData.originStation);
    if (!originStation) {
      throw new Error("Không tìm thấy bến đi");
    }
    if (originStation.status !== "active") {
      throw new Error("Bến đi hiện không hoạt động");
    }

    // Kiểm tra trạng thái của destinationStation
    const destinationStation = await Station.findById(
      routeData.destinationStation
    );
    if (!destinationStation) {
      throw new Error("Không tìm thấy bến đến");
    }
    if (destinationStation.status !== "active") {
      throw new Error("Bến đến hiện không hoạt động");
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
      throw new Error("Không tìm thấy tuyến đường");
    }
    if (route.status !== "inactive") {
      throw new Error(
        "Chỉ được xóa tuyến đường có trạng thái 'ngừng hoạt động'"
      );
    }
    // Kiểm tra còn trip nào liên kết không
    const tripCount = await require("../models/Trip").Trip.countDocuments({
      route: routeId,
    });
    if (tripCount > 0) {
      throw new Error(
        "Không thể xóa tuyến đường: vẫn còn chuyến xe liên kết với tuyến này"
      );
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
