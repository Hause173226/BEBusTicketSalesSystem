import { Seat } from "../models/Seat";

// Tạo danh sách ghế cho 1 bus (A1-A20, B1-B20)
export async function generateSeatsForBus(busId: string) {
  const seats = [];
  for (let row of ["A", "B"]) {
    for (let num = 1; num <= 20; num++) {
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
