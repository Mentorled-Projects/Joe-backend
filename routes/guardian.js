const express = require("express");
const router = express.Router();
const { completeProfile, getAllGuardians, getGuardianById, getPaginatedGuardians, getGuardianByPhoneNumber } = require('../controllers/guardianController')
const  authMiddleware  = require('../middleware/authMiddleware');
const onlyAdmin = require ('../middleware/adminMiddleware')

/**
 * @swagger
 * tags:
 *   name: Guardian Management
 *   description: Endpoints for guardian management
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
 * /api/v1/guardian/complete-profile:
 *   put:
 *     summary: Complete user profile after initial registration
 *     tags: [Guardian Management]
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
 *               relationship:
 *                 type: string
 *                 example: Father
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

/**
 * @swagger
 * components:
 *   schemas:
 *     File:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         url:
 *           type: string
 *         filename:
 *           type: string
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
 *         files:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/File'
 *         child:
 *           $ref: '#/components/schemas/Child'
 *
 * /api/v1/guardian/get-all-guardians:
 *   get:
 *     summary: Get all guardians
 *     tags: [Guardian Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All guardians retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Guardian'
 *       400:
 *         description: Bad request - Missing or invalid data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access only
 *       500:
 *         description: Internal server error
 */

router.get("/get-all-guardians", authMiddleware, onlyAdmin, getAllGuardians)

/**
 * @swagger
 * /api/v1/guardian/get-by-id/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Guardian Management]
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

router.get ("/get-by-id/:id", authMiddleware, onlyAdmin, getGuardianById)

/**
 * @swagger
 * /api/v1/guardian/by-phone:
 *   get:
 *     summary: Get a guardian by phone number
 *     tags: [Guardian Management]
 *     description: Retrieve a guardian using their phone number
  *     parameters:
 *       - in: query
 *         name: phoneNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: Phone number of the guardian
 *         example: "+1234567890"
 *     responses:
 *       200:
 *         description: Guardian retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 child:
 *                   type: object
 *                   description: Linked child information
 *       404:
 *         description: Guardian not found
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.get ("/by-phone", getGuardianByPhoneNumber)

/**
 * @swagger
 * /api/v1/guardian/get-paginated:
 *   get:
 *     summary: Get paginated list of guardians
 *     tags: [Guardian Management]
 *     description: Fetch a paginated list of guardians with optional search filter.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of guardians per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Optional search by name or email
 *     responses:
 *       200:
 *         description: Paginated guardians fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalGuardians:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 guardians:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       phoneNumber:
 *                         type: string
 *                       email:
 *                         type: string
 *                       child:
 *                         type: object
 *                         description: Linked child data
 *       500:
 *         description: Internal server error
 */

router.get("/get-paginated", authMiddleware, onlyAdmin, getPaginatedGuardians)





module.exports = router;
