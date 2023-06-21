"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const validate_1 = __importDefault(require("../middleware/validate"));
const express_validator_1 = require("express-validator");
const userRouter = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for user authentication
 *
 * /api/v1/users/signin:
 *   post:
 *     summary: User sign-in
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User signed in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */
userRouter.post("/signin", (0, validate_1.default)([
    (0, express_validator_1.body)("username").exists().isString(),
    (0, express_validator_1.body)("password").exists().isString(),
]), user_controller_1.singin);
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for user authentication
 *
 * /api/v1/users/signup:
 *   post:
 *     summary: User sign-up
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed up successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */
userRouter.post("/signup", (0, validate_1.default)([
    (0, express_validator_1.body)("email").exists().isString(),
    (0, express_validator_1.body)("password").exists().isString(),
    (0, express_validator_1.body)("username").exists().isString(),
    (0, express_validator_1.body)("firstname").exists().isString(),
    (0, express_validator_1.body)("lastname").exists().isString(),
]), user_controller_1.signup);
exports.default = userRouter;
