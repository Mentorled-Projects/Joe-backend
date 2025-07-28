const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); 
const { createPost, getPostsByChildId, getPostById, updatePost, deletePost } = require('../controllers/postController');


/**
 * @swagger
 * /api/v1/post/add-post:
 *   post:
 *     summary: Create a new post for a child's profile
 *     tags: [Posts]
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
 *               - content
 *             properties:
 *               child:
 *                 type: string
 *                 description: The ID of the child creating the post
 *                 example: 665f81c56e9dbcb0e4c6d123
 *               content:
 *                 type: string
 *                 description: The post content
 *                 example: "I just finished my first science experiment!"
 *               images:
 *                 type: string
 *                 description: Optional image URL
 *                 example: "[(image url extracted from cloudinary)]"
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.post("/add-post", authMiddleware, createPost);

/**
 * @swagger
 * /api/v1/post/get-all-post/{childId}:
 *   get:
 *     summary: Get all posts created by a specific child
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: childId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the child whose posts you want to retrieve
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 posts:
 *                   type: array
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No posts found
 *       500:
 *         description: Server error
 */

router.get("/get-all-post/:childId", authMiddleware, getPostsByChildId);

/**
 * @swagger
 * /api/v1/post/get-by-id/{id}:
 *   get:
 *     summary: Get a single post by its ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Post not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.get("/get-by-id/:id", authMiddleware, getPostById);

/**
 * @swagger
 * /api/v1/post/update/{id}:
 *   put:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Updated post content"
 *               image:
 *                 type: string
 *                 example: "https://cdn.peenlyapp.com/posts/updated-image.jpg"
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Post not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.put("/update/:id", authMiddleware, updatePost);


/**
 * @swagger
 * /api/v1/post/delete/{id}:
 *   delete:
 *     summary: Delete a post by its ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
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
 *                   example: Post deleted
 *       404:
 *         description: Post not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.delete("/delete/:id", authMiddleware, deletePost);




module.exports = router;
