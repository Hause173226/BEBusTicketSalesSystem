import { BusOperator } from "../models/BusOperator";

export const busOperatorService = {
  // Tạo mới bus operator
  createBusOperator: async (operatorData: any) => {
    const operator = await BusOperator.create(operatorData);
    return operator;
  },

  // Lấy tất cả bus operator
  getAllBusOperators: async () => {
    const operators = await BusOperator.find().lean();
    return operators;
  },

  // Cập nhật bus operator
  updateBusOperator: async (operatorId: string, updateData: any) => {
    const operator = await BusOperator.findByIdAndUpdate(
      operatorId,
      updateData,
      { new: true }
    );
    if (!operator) {
      throw new Error("Bus operator not found");
    }
    return operator;
  },

  // Xóa bus operator
  deleteBusOperator: async (operatorId: string) => {
    const operator = await BusOperator.findByIdAndDelete(operatorId);
    if (!operator) {
      throw new Error("Bus operator not found");
    }
    return operator;
  },
};
