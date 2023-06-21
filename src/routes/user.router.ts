import { Router } from "express";
import { signup, singin } from "../controllers/user.controller";
import validate from "../middleware/validate";
import { body } from "express-validator";

const userRouter = Router();

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
userRouter.post(
  "/signin",
  validate([
    body("username").exists().isString(),
    body("password").exists().isString(),
  ]),
  singin
);

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
userRouter.post(
  "/signup",
  validate([
    body("email").exists().isString(),
    body("password").exists().isString(),
    body("username").exists().isString(),
    body("firstname").exists().isString(),
    body("lastname").exists().isString(),
  ]),
  signup
);

export default userRouter;
