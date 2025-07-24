import cron from "node-cron";
import { Trip } from "../models/Trip";

// Chạy mỗi phút
cron.schedule("* * * * *", async () => {
  const now = new Date();

  // 1. scheduled → in_progress
  const scheduledTrips = await Trip.find({ status: "scheduled" });
  for (const trip of scheduledTrips) {
    const [depHour, depMinute] = trip.departureTime.split(":").map(Number);
    const depDate = new Date(trip.departureDate);
    depDate.setHours(depHour, depMinute, 0, 0);
    if (now >= depDate) {
      trip.status = "in_progress";
      await trip.save();
    }
  }

  // 2. in_progress → completed
  const inProgressTrips = await Trip.find({ status: "in_progress" });
  for (const trip of inProgressTrips) {
    if (!trip.arrivalTime) continue;
    const [depHour, depMinute] = trip.departureTime.split(":").map(Number);
    const [arrHour, arrMinute] = trip.arrivalTime.split(":").map(Number);
    const depDate = new Date(trip.departureDate);
    depDate.setHours(depHour, depMinute, 0, 0);
    const arrDate = new Date(trip.departureDate);
    arrDate.setHours(arrHour, arrMinute, 0, 0);
    // Nếu giờ đến nhỏ hơn hoặc bằng giờ đi, cộng thêm 1 ngày cho arrDate
    if (
      arrHour < depHour ||
      (arrHour === depHour && arrMinute <= depMinute)
    ) {
      arrDate.setDate(arrDate.getDate() + 1);
    }
    if (now >= arrDate) {
      trip.status = "completed";
      await trip.save();
    }
  }
});

console.log("Trip status updater cron job started."); 