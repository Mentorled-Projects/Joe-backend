const express = require("express");
const { registerGuardian, registerTutor, registerAdmin, resendOTP, verifyOTP, login, forgotPassword, resendForgotPasswordOTP, resetPassword, requestEmailVerification, verifyEmailOtp } = require("../controllers/authController");
const router = express.Router();
const  authMiddleware  = require('../middleware/authMiddleware');
const onlyAdmin = require ('../middleware/adminMiddleware')




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
 *         description: Verification otp sent to your phone number, verify otp to complete your registration
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
 *         description: Verification otp sent to your phone number, verify otp to complete your registration
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
 * /api/v1/auth/send-email-otp:
 *   post:
 *     summary: Send email verification otp
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: example@email.com
 *     responses:
 *       200:
 *         description: Otp sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Verification email sent
 *       400:
 *         description: Missing or invalid email
 *       500:
 *         description: Server error
 */


router.post('/send-email-otp', authMiddleware, requestEmailVerification);

/**
 * @swagger
 * /api/v1/auth/verify-email:
 *   post:
 *     summary: Verify email using otp
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *                 example: 483920
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Email verified successfully
 *       400:
 *         description: Invalid or expired otp
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.post('/verify-email', authMiddleware, verifyEmailOtp);
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

/**
 * @swagger
 * /api/v1/auth/register-admin:
 *   post:
 *     summary: Register a new admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - phoneNumber
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
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
 *         description: Verification otp sent to your phone number, verify otp to complete your registration
 *       400:
 *         description: Bad request - Missing or invalid fields
 *       409:
 *         description: Conflict - Admin already exists
 *       500:
 *         description: Internal server error
 */

router.post("/register-admin", registerAdmin);

/**
 * @swagger
 * /api/v1/auth/resend-otp:
 *   post:
 *     summary: Resend verification OTP
 *     tags: [Auth]
 *     requestBody:
 *       description: Resend verification OTP
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
 *     responses:
 *       201:
 *         description: Verification otp has been reset to your phone number, verify otp to complete your registration
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

router.post("/resend-otp", resendOTP);


/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number with country code (e.g., +234XXXXXXXXXX). Country code is compulsory.
 *                 example: "+2348123456789"
 *     responses:
 *       200:
 *         description: Password reset otp sent
 *       400:
 *         description: Invalid request or phone number not found
 *       500:
 *         description: Internal server error
 */

router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /api/v1/auth/resend-forgot-password-otp:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number with country code (e.g., +234XXXXXXXXXX). Country code is compulsory.
 *                 example: "+2348123456789"
 *     responses:
 *       200:
 *         description: Password reset otp resent
 *       400:
 *         description: Invalid request or phone number not found
 *       500:
 *         description: Internal server error
 */

router.post("/resend-forgot-password-otp", resendForgotPasswordOTP);

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *               - newPassword
 *               - phoneNumber
 *             properties:
 *               otp:
 *                 type: string
 *                 description: The reset otp sent to phone number
 *               newPassword:
 *                 type: string
 *                 format: password
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number with country code (e.g., +234XXXXXXXXXX). Country code is compulsory.
 *                 example: "+2348123456789"
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Internal server error
 */

router.post("/reset-password", resetPassword);

module.exports = router;
