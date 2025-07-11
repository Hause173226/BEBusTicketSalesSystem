import multer from "multer";
import path from "path";

const storage = multer.memoryStorage(); // Lưu file vào RAM để upload lên Firebase

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  // Chỉ chấp nhận file ảnh
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file ảnh!"), false);
  }
};

const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default uploadAvatar;
