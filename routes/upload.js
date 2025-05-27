const express = require("express");
const { uploadFile } = require("../controllers/uploadController");
const router = express.Router();
const multer = require ('multer');
const authMiddleware = require("../middleware/authMiddleware"); 


const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * tags:
 *   name: File Management
 *   description: Endpoints for file management
 */

/**
 * @swagger
 * /api/v1/upload/uploadFile:
 *   post:
 *     summary: Upload a file
 *     tags: [File Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - phoneNumber
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to be uploaded
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number with country code (e.g., +234XXXXXXXXXX). Country code is compulsory.
 *                 example: "+2348123456789"
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       400:
 *         description: Bad request - No file uploaded or phone number missing
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */


router.post('/uploadFile', authMiddleware, upload.single('file'), uploadFile);

module.exports = router;
