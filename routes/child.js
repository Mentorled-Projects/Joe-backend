const express = require("express");
const router = express.Router();
const { addChild, getAllChildren, getChildById , addMilestone, getMilestonesByChildId, updateAbout} = require('../controllers/ChildController')
const authMiddleware = require("../middleware/authMiddleware"); 
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
 * /api/v1/child/add-milestone:
 *   post:
 *     summary: Add a new milestone to a child's profile
 *     tags: [Child Management]
 *     security:
 *       - bearerAuth: []  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - child
 *               - title
 *             properties:
 *               child:
 *                 type: string
 *                 description: The ID of the child
 *                 example: 665f81c56e9dbcb0e4c6d123
 *               title:
 *                 type: string
 *                 description: Milestone title
 *                 example: Finished phonics level 1
 *               description:
 *                 type: string
 *                 description: Optional milestone description
 *                 example: Completed all phonics exercises and can read simple books
 *               Date:
 *                 type: string
 *                 format: date
 *                 description: Date the milestone was achieved
 *                 example: 2024-06-30
 *               images:
 *                 type: string
 *                 description: Optional image URL
 *                 example: "[(image url extracted from cloudinary)]"
 *     responses:
 *       201:
 *         description: Milestone created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */


router.post("/add-milestone", authMiddleware, addMilestone);

/**
 * @swagger
 * /api/v1/child/get-milestones/{childId}:
 *   get:
 *     summary: Get all milestones for a specific child
 *     tags: [Child Management]
 *     security:
 *       - bearerAuth: []  # Include if using JWT or other auth
 *     parameters:
 *       - in: path
 *         name: childId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the child whose milestones you want to retrieve
 *     responses:
 *       200:
 *         description: List of milestones retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 milestones:
 *                   type: array
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Child not found or no milestones available
 *       500:
 *         description: Server error
 */

router.get("/get-milestones/:childId", authMiddleware, getMilestonesByChildId);


/**
 * @swagger
 * /api/v1/child/{childId}/about:
 *   patch:
 *     summary: Add or update a child's About section
 *     tags: [Child Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Child's ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               about:
 *                 type: string
 *                 example: "I love drawing and coding with my tutor."
 *     responses:
 *       200:
 *         description: About section updated
 *       404:
 *         description: Child not found
 *       500:
 *         description: Server error
 */

router.patch("/:childId/about", authMiddleware, updateAbout)
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

router.get("/get-all-children", authMiddleware, getAllChildren)

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

router.get("/get-by-id/:id", authMiddleware, getChildById)



module.exports = router;
