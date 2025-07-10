import { Bus } from "../models/Bus";
import { Seat } from "../models/Seat";

// Tạo danh sách ghế cho 1 bus (A1-A20, B1-B20)
export async function generateSeatsForBus(busId: string) {
  // Lấy thông tin bus để biết seatCount
  const bus = await Bus.findById(busId);
  if (!bus) throw new Error("Bus not found");

  const seatCount = bus.seatCount || 40; // Mặc định là 40 nếu không có seatCount

  // Tính toán số hàng và số ghế mỗi hàng
  const rows = ["A", "B"];
  const seatsPerRow = Math.ceil(seatCount / rows.length);

  const seats = [];
  for (let row of rows) {
    for (let num = 1; num <= seatsPerRow && seats.length < seatCount; num++) {
      seats.push({
        bus: busId,
        seatNumber: `${row}${num}`,
      });
    }
  }

  // Kiểm tra đã tạo ghế chưa
  const existingSeats = await Seat.find({ bus: busId });
  if (existingSeats.length > 0) {
    throw new Error("Seats already exist for this bus");
  }

  await Seat.insertMany(seats);
  return { message: "Seats created successfully", count: seats.length };
}

// Lấy danh sách ghế của bus (chỉ thông tin cơ bản)
export async function getSeatsByBus(busId: string) {
  const seats = await Seat.find({ bus: busId }).lean();
  // Sắp xếp đúng thứ tự A1-A20, B1-B20
  seats.sort((a, b) => {
    const [rowA, numA] = [a.seatNumber[0], parseInt(a.seatNumber.slice(1))];
    const [rowB, numB] = [b.seatNumber[0], parseInt(b.seatNumber.slice(1))];
    if (rowA === rowB) return numA - numB;
    return rowA.localeCompare(rowB);
  });
  return seats;
}
