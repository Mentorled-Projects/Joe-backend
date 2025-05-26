const express = require("express");
const { registerGuardian, registerTutor, registerAdmin, verifyOTP, login } = require("../controllers/authController");
const router = express.Router();



/**
 * @swagger
 * tags:
 *   name: Guardian Management
 *   description: Endpoints for guardian
 */
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentications Endpoints
 */


/**
 * @swagger
 * /api/v1/auth/register-guardian:
 *   post:
 *     summary: Register a new guardian
 *     tags: [Auth]
 *     requestBody:
 *       description: Guardian registration details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number with country code (e.g., +234XXXXXXXXXX). Country code is compulsory.
 *                 example: "+2348012345678"
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: "67123"
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

router.post("/register-guardian", registerGuardian);

/**
 * @swagger
 * /api/v1/auth/register-tutor:
 *   post:
 *     summary: Register a new tutor
 *     tags: [Auth]
 *     requestBody:
 *       description: Tutor registration details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number with country code (e.g., +234XXXXXXXXXX). Country code is compulsory.
 *                 example: "+2348012345678"
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: "67123"
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

router.post("/register-tutor", registerTutor);


/**
 * @swagger
 * /api/v1/auth/verify-otp:
 *   post:
 *     summary: Verify a user's OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - otp
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number with country code (e.g., +234XXXXXXXXXX). Country code is compulsory.
 *                 example: "+2348123456789"
 *               otp:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid OTP or phone number
 *       500:
 *         description: Internal server error
 */
router.post("/verify-otp", verifyOTP);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login to Peenly
 *     tags: [Auth]
 *     requestBody:
 *       description: User login details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number with country code (e.g., +234XXXXXXXXXX). Country code is compulsory.
 *                 example: "+2348123456789"
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: "67123"
 *     responses:
 *       201:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */


router.post("/login", login);

router.post("/register-admin", registerAdmin);


module.exports = router;
