"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const article_controller_1 = require("../controllers/article.controller");
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const validate_1 = __importDefault(require("../middleware/validate"));
const express_validator_1 = require("express-validator");
const articleRouter = (0, express_1.Router)();
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
articleRouter.post("/", [
    verifyToken_1.default,
    (0, validate_1.default)([
        (0, express_validator_1.body)("title").exists().isString(),
        (0, express_validator_1.body)("content").exists().isString(),
        (0, express_validator_1.body)("tags").exists().isArray(),
        (0, express_validator_1.body)("tags.*").exists().isString(),
    ]),
], article_controller_1.createArticle);
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
    verifyToken_1.default,
    (0, validate_1.default)([(0, express_validator_1.query)("creatorId").optional().isString()]),
    article_controller_1.getArticle,
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
    verifyToken_1.default,
    (0, validate_1.default)([(0, express_validator_1.body)("articleId").exists().isNumeric()]),
    article_controller_1.deleteArticle,
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
    verifyToken_1.default,
    (0, validate_1.default)([
        (0, express_validator_1.body)("articleId").exists().isNumeric(),
        (0, express_validator_1.body)("title").optional().isString(),
        (0, express_validator_1.body)("content").optional().isString(),
    ]),
    article_controller_1.updateArticle
]);
exports.default = articleRouter;
