import { Request, Response } from "express";
import multer from "multer";
import { FirebaseUploadService } from "../services/firebaseUploadService";

// Cấu hình multer để sử dụng memory storage cho Firebase
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

export const uploadSingle = upload.single("image");
export const uploadMultiple = upload.array("images", 5); // Tối đa 5 ảnh

// Upload ảnh profile user
export const uploadProfileImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const validation = FirebaseUploadService.validateImageFile(file);
    if (!validation.isValid) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const result = await FirebaseUploadService.uploadProfileImage(file);
    
    if (result.success) {
      res.json({ 
        success: true,
        url: result.url,
        message: "Profile image uploaded successfully"
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: result.error || "Upload failed"
      });
    }
  } catch (error) {
    console.error('Upload profile image error:', error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error" 
    });
  }
};

// Upload ảnh admin
export const uploadAdminImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const validation = FirebaseUploadService.validateImageFile(file);
    if (!validation.isValid) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const result = await FirebaseUploadService.uploadAdminImage(file);
    
    if (result.success) {
      res.json({ 
        success: true,
        url: result.url,
        message: "Admin image uploaded successfully"
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: result.error || "Upload failed"
      });
    }
  } catch (error) {
    console.error('Upload admin image error:', error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error" 
    });
  }
};

// Upload ảnh bus (single)
export const uploadBusImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const validation = FirebaseUploadService.validateImageFile(file);
    if (!validation.isValid) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const result = await FirebaseUploadService.uploadBusImage(file);
    
    if (result.success) {
      res.json({ 
        success: true,
        url: result.url,
        message: "Bus image uploaded successfully"
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: result.error || "Upload failed"
      });
    }
  } catch (error) {
    console.error('Upload bus image error:', error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error" 
    });
  }
};

// Upload nhiều ảnh bus (gallery)
export const uploadBusImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ error: "No files uploaded" });
      return;
    }

    // Validate all files
    for (const file of files) {
      const validation = FirebaseUploadService.validateImageFile(file);
      if (!validation.isValid) {
        res.status(400).json({ error: `File ${file.originalname}: ${validation.error}` });
        return;
      }
    }

    const results = await FirebaseUploadService.uploadBusImages(files);
    
    const successfulUploads = results.filter(result => result.success);
    const failedUploads = results.filter(result => !result.success);

    res.json({ 
      success: true,
      uploaded: successfulUploads.length,
      failed: failedUploads.length,
      urls: successfulUploads.map(result => result.url),
      errors: failedUploads.map(result => result.error),
      message: `${successfulUploads.length} images uploaded successfully`
    });
  } catch (error) {
    console.error('Upload bus images error:', error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error" 
    });
  }
};

// Xóa ảnh
export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      res.status(400).json({ error: "Image URL is required" });
      return;
    }

    const success = await FirebaseUploadService.deleteImage(imageUrl);
    
    if (success) {
      res.json({ 
        success: true,
        message: "Image deleted successfully"
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: "Failed to delete image"
      });
    }
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error" 
    });
  }
};

// Legacy function for backward compatibility
export const uploadImage = uploadProfileImage; 