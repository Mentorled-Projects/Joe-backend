const express = require("express");
const router = express.Router();
const { completeProfile } = require('../controllers/tutorController')
const authMiddleware = require("../middleware/authMiddleware"); // you import it here


/**
 * @swagger
 * tags:
 *   name: Tutor Management
 *   description: Endpoints for tutor management
 */
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


/**
 * @swagger
 * /api/v1/tutor/complete-profile:
 *   put:
 *     summary: Complete user profile after initial registration
 *     tags: [Tutor Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: Johndoe@gmail.com
 *               dateOfBirth:
 *                 type: string
 *                 example: "01/02/2022"
 *               city:
 *                 type: string
 *                 example: "Lagos"
 *               gender:
 *                 type: string
 *                 example: Male
 *               language:
 *                 type: string
 *                 example: Spanish
 *               religion:
 *                 type: string
 *                 example: Christianity
 *     responses:
 *       200:
 *         description: Profile completed successfully
 *       400:
 *         description: Missing or invalid data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.put("/complete-profile", authMiddleware, completeProfile);



module.exports = router;
