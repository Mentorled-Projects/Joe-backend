const express = require("express");
const router = express.Router();
const { addChild } = require('../controllers/ChildController')
const authMiddleware = require("../middleware/authMiddleware"); // you import it here


/**
 * @swagger
 * tags:
 *   name: Child Management
 *   description: Endpoints for child management
 */

/**
 * @swagger
 * /api/v1/child/add-child:
 *   post:
 *     summary: Add child profile
 *     tags: [Child Management]
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
 *               middleName:
 *                 type: string
 *                 example: Henry
 *               Class:
 *                 type: string
 *                 example: Grade2
 *               schoolName:
 *                 type: string
 *                 example: Rosebud Montesorri
 *               sports: 
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["football", "tennis"]
 *               educationalLevel:
 *                 type: string
 *                 example: Pre-school
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["coding", "music", "travel"]
 *               dateOfBirth:
 *                 type: string
 *                 example: "01/02/2022"
 *               gender:
 *                 type: string
 *                 example: Male
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

router.post("/add-child", authMiddleware, addChild);



module.exports = router;
