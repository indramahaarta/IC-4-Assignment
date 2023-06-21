import { Router } from "express";
import {
  createArticle,
  deleteArticle,
  getArticle,
  updateArticle,
} from "../controllers/article.controller";
import verifyToken from "../middleware/verifyToken";
import validate from "../middleware/validate";
import { body, query } from "express-validator";

const articleRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: API endpoints for managing articles
 *
 * /api/v1/articles:
 *   post:
 *     summary: Create an article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: The created article
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 creator:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 */
articleRouter.post(
  "/",
  [
    verifyToken,
    validate([
      body("title").exists().isString(),
      body("content").exists().isString(),
      body("tags").exists().isArray(),
      body("tags.*").exists().isString(),
    ]),
  ],
  createArticle
);

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: API endpoints for managing articles
 *
 * /api/v1/articles:
 *   get:
 *     summary: Get articles
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: creatorId
 *         schema:
 *           type: string
 *         description: Filter articles by creator ID
 *     responses:
 *       200:
 *         description: The list of articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   creator:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 */
articleRouter.get("/", [
  verifyToken,
  validate([query("creatorId").optional().isString()]),
  getArticle,
]);

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: API endpoints for managing articles
 *
 * /api/v1/articles:
 *   delete:
 *     summary: Delete an article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articleId:
 *                 type: number
 *     responses:
 *       200:
 *         description: Article deleted successfully
 *       404:
 *         description: Article not found
 *       500:
 *         description: Internal server error
 */
articleRouter.delete("/", [
  verifyToken,
  validate([body("articleId").exists().isNumeric()]),
  deleteArticle,
]);

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: API endpoints for managing articles
 *
 * /api/v1/articles:
 *   patch:
 *     summary: Update an article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articleId:
 *                 type: number
 *                 description: ID of the article to update
 *               title:
 *                 type: string
 *                 description: Updated title of the article
 *               content:
 *                 type: string
 *                 description: Updated content of the article
 *     responses:
 *       200:
 *         description: Article updated successfully
 *       404:
 *         description: Article not found
 *       500:
 *         description: Internal server error
 */
articleRouter.patch("/", [
  verifyToken,
  validate([
    body("articleId").exists().isNumeric(),
    body("title").optional().isString(),
    body("content").optional().isString(),
  ]),
  updateArticle
]);

export default articleRouter;
