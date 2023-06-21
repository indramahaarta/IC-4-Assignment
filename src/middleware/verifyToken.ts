import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface CustomerRequest extends Request {
  userId?: Number;
}

const verifyToken = (
  req: CustomerRequest,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization?.split(" ")[1];
    jwt.verify(
      String(token),
      String(process.env.SECRET),
      async (err, payload) => {
        if (err) {
          return res
            .status(403)
            .send({ message: "Token is not valid or expired!" });
        }
        const { id } = payload as { id: number };
        req.userId = Number(id);
        next();
      }
    );
  } else {
    return res.status(401).send({ message: "Unauthorized!" });
  }
};

export default verifyToken;
