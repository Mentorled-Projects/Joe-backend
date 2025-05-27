const express = require("express");
const router = express.Router();
const { addChild, getAllChildren, getChildById } = require('../controllers/ChildController')
const authMiddleware = require("../middleware/authMiddleware"); // you import it here
const onlyAdmin = require("../middleware/adminMiddleware");


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

/**
 * @swagger
 * components:
 *   schemas:
 *     Child:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         firstName:
 *           type: string
 *         age:
 *           type: number
 *         gender:
 *           type: string
 *     Guardian:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         fullName:
 *           type: string
 *         email:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         guardian:
 *           $ref: '#/components/schemas/Guardian'
 *
 * /api/v1/child/get-all-children:
 *   get:
 *     summary: Get all children
 *     tags: [Child Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All children retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Child'
 *       400:
 *         description: Bad request - Missing or invalid data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access only
 *       500:
 *         description: Internal server error
 */

router.get("/get-all-children", authMiddleware, onlyAdmin, getAllChildren)

/**
 * @swagger
 * /api/v1/child/get-by-id/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Child Management]
 *     security:
 *       - bearerAuth: []
 *     description: Returns a user with a specific ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the user
 *         example: "64f7a9d8a123456"
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "1"
 *                 name:
 *                   type: string
 *                   example: "Oliver Twist"
 *                 email:
 *                   type: string
 *                   example: "example@gmail.com"
 */

router.get("/get-by-id/:id", authMiddleware, onlyAdmin, getChildById)



module.exports = router;
