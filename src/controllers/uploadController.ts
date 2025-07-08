import { Request, Response } from "express";
import multer, { StorageEngine } from "multer";
import path from "path";

// Cấu hình nơi lưu file và tên file
const storage: StorageEngine = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, "uploads/"); // Thư mục lưu file (tạo thư mục này ở gốc project)
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

export const uploadSingle = upload.single("image"); // "image" là tên field gửi lên

export const uploadImage = (req: Request, res: Response): void => {
  const file = (req as Request & { file?: Express.Multer.File }).file;
  if (!file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
  res.json({ url: fileUrl });
}; 