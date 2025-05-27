/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile and management endpoints
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
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
 *                   example: Profile retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: johndoe
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-01T00:00:00.000Z"
 *       401:
 *         description: Unauthorized, invalid or missing token
 */

/**
 * @swagger
 * /api/user/edit:
 *   post:
 *     summary: Update user profile information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoeUpdated
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.updated@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: NewStrongPassword123
 *     responses:
 *       200:
 *         description: User profile updated successfully
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
 *                   example: Profile updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: johndoeUpdated
 *                     email:
 *                       type: string
 *                       example: john.updated@example.com
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       409:
 *         description: Email already in use
 */
