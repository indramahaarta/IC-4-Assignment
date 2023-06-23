import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import db from "../config/db";
import MailChecker from "mailchecker";

export const singin = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await db
    .selectFrom("User")
    .where("User.username", "=", username)
    .select(["User.id", "User.email", "User.password", "User.username"])
    .executeTakeFirst();

  if (!user) {
    return res.status(400).send({ message: "User not found!" });
  }

  if (user.password !== password) {
    return res.status(400).send({ message: "Wrong password" });
  }

  const data = { id: user.id, username: user.username, email: user.email };

  const token = jwt.sign({ id: user.id }, String(process.env.SECRET), {
    expiresIn: 60 * 60 * 4,
  });

  return res
    .status(200)
    .send({ message: "User signed in successfully", ...data, token });
};

export const signup = async (req: Request, res: Response) => {
  const {
    username,
    email,
    password,
    firstname,
    lastname,
  }: {
    username: string;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
  } = req.body;

  if (!MailChecker.isValid(email)) {
    return res.status(400).send({ message: "Email is not valid!" });
  }

  await db.transaction().execute(async (trx) => {
    try {
      const user = await trx
        .insertInto("User")
        .values({ email: email, password: password, username: username })
        .returning(["id", "username", "email"])
        .executeTakeFirstOrThrow();

      await trx
        .insertInto("Profile")
        .values({ firstname: firstname, lastname: lastname, userId: user.id })
        .executeTakeFirstOrThrow();

      const token = jwt.sign({ id: user.id }, String(process.env.SECRET), {
        expiresIn: 60 * 60 * 4,
      });

      return res
        .status(200)
        .send({ message: "User signed up successfully", ...user, token });
    } catch (err: any) {
      return res.status(500).send(err);
    }
  });
};
