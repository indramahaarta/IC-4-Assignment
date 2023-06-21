"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization) {
        const token = authorization === null || authorization === void 0 ? void 0 : authorization.split(" ")[1];
        jsonwebtoken_1.default.verify(String(token), String(process.env.SECRET), (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res
                    .status(403)
                    .send({ message: "Token is not valid or expired!" });
            }
            const { id } = payload;
            req.userId = Number(id);
            next();
        }));
    }
    else {
        return res.status(401).send({ message: "Unauthorized!" });
    }
};
exports.default = verifyToken;
