import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export class FirebaseUploadService {
  /**
   * Upload ảnh profile user
   */
  static async uploadProfileImage(file: Express.Multer.File): Promise<UploadResult> {
    try {
      const fileName = `profiles/${uuidv4()}_${file.originalname}`;
      const storageRef = ref(storage, fileName);
      
      const snapshot = await uploadBytes(storageRef, file.buffer);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        success: true,
        url: downloadURL
      };
    } catch (error) {
      console.error('Error uploading profile image:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Upload ảnh admin
   */
  static async uploadAdminImage(file: Express.Multer.File): Promise<UploadResult> {
    try {
      const fileName = `admins/${uuidv4()}_${file.originalname}`;
      const storageRef = ref(storage, fileName);
      
      const snapshot = await uploadBytes(storageRef, file.buffer);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        success: true,
        url: downloadURL
      };
    } catch (error) {
      console.error('Error uploading admin image:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Upload ảnh bus
   */
  static async uploadBusImage(file: Express.Multer.File): Promise<UploadResult> {
    try {
      const fileName = `buses/${uuidv4()}_${file.originalname}`;
      const storageRef = ref(storage, fileName);
      
      const snapshot = await uploadBytes(storageRef, file.buffer);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        success: true,
        url: downloadURL
      };
    } catch (error) {
      console.error('Error uploading bus image:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Upload multiple ảnh cho bus (gallery)
   */
  static async uploadBusImages(files: Express.Multer.File[]): Promise<UploadResult[]> {
    const uploadPromises = files.map(file => this.uploadBusImage(file));
    return Promise.all(uploadPromises);
  }

  /**
   * Xóa ảnh từ Firebase Storage
   */
  static async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      // Extract file path from URL
      const url = new URL(imageUrl);
      const filePath = decodeURIComponent(url.pathname.split('/o/')[1].split('?')[0]);
      
      const imageRef = ref(storage, filePath);
      await deleteObject(imageRef);
      
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  /**
   * Validate file type
   */
  static validateImageFile(file: Express.Multer.File): { isValid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.mimetype)) {
      return {
        isValid: false,
        error: 'File type not allowed. Only JPEG, PNG, GIF, and WebP are supported.'
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size too large. Maximum size is 5MB.'
      };
    }

    return { isValid: true };
  }
}
