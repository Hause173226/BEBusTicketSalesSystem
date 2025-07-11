import express from "express";
import { 
  uploadSingle, 
  uploadMultiple,
  uploadProfileImage, 
  uploadAdminImage, 
  uploadBusImage, 
  uploadBusImages,
  deleteImage,
  uploadImage // Legacy function
} from "../controllers/uploadController";
import { authenticateJWT } from "../middlewares/authenticate";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Image upload and management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UploadResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         url:
 *           type: string
 *           description: The uploaded image URL
 *         message:
 *           type: string
 *     MultipleUploadResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         uploaded:
 *           type: number
 *           description: Number of successfully uploaded images
 *         failed:
 *           type: number
 *           description: Number of failed uploads
 *         urls:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs of successfully uploaded images
 *         errors:
 *           type: array
 *           items:
 *             type: string
 *           description: Error messages for failed uploads
 *         message:
 *           type: string
 *     DeleteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         error:
 *           type: string
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload image (Legacy endpoint)
 *     description: Legacy endpoint for backward compatibility - uploads profile image
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload (JPEG, PNG, GIF, WebP, max 5MB)
 *             required:
 *               - image
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       400:
 *         description: Bad request - no file uploaded or invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Legacy route for backward compatibility
router.post("/", uploadSingle, uploadImage);

/**
 * @swagger
 * /upload/profile:
 *   post:
 *     summary: Upload user profile image
 *     description: Upload a profile image for authenticated user
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Profile image file (JPEG, PNG, GIF, WebP, max 5MB)
 *             required:
 *               - image
 *     responses:
 *       200:
 *         description: Profile image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       400:
 *         description: Bad request - no file uploaded or invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing JWT token
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Upload profile image (user)
router.post("/profile", authenticateJWT, uploadSingle, uploadProfileImage);

/**
 * @swagger
 * /upload/admin:
 *   post:
 *     summary: Upload admin image
 *     description: Upload an image for admin purposes
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Admin image file (JPEG, PNG, GIF, WebP, max 5MB)
 *             required:
 *               - image
 *     responses:
 *       200:
 *         description: Admin image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       400:
 *         description: Bad request - no file uploaded or invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing JWT token
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Upload admin image
router.post("/admin", authenticateJWT, uploadSingle, uploadAdminImage);

/**
 * @swagger
 * /upload/bus:
 *   post:
 *     summary: Upload single bus image
 *     description: Upload a single image for a bus
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Bus image file (JPEG, PNG, GIF, WebP, max 5MB)
 *             required:
 *               - image
 *     responses:
 *       200:
 *         description: Bus image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       400:
 *         description: Bad request - no file uploaded or invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing JWT token
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Upload single bus image
router.post("/bus", authenticateJWT, uploadSingle, uploadBusImage);

/**
 * @swagger
 * /upload/bus/gallery:
 *   post:
 *     summary: Upload multiple bus images
 *     description: Upload multiple images for a bus gallery (maximum 5 images)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Multiple bus image files (JPEG, PNG, GIF, WebP, max 5MB each, max 5 files)
 *             required:
 *               - images
 *     responses:
 *       200:
 *         description: Bus images uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MultipleUploadResponse'
 *       400:
 *         description: Bad request - no files uploaded or invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing JWT token
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Upload multiple bus images
router.post("/bus/gallery", authenticateJWT, uploadMultiple, uploadBusImages);

/**
 * @swagger
 * /upload:
 *   delete:
 *     summary: Delete an image
 *     description: Delete an uploaded image by its URL
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrl:
 *                 type: string
 *                 description: URL of the image to delete
 *                 example: "https://firebasestorage.googleapis.com/..."
 *             required:
 *               - imageUrl
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *       400:
 *         description: Bad request - image URL is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing JWT token
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Delete image
router.delete("/", authenticateJWT, deleteImage);

export default router; 