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
exports.signup = exports.singin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
const singin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield db_1.default
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
    const token = jsonwebtoken_1.default.sign({ id: user.id }, String(process.env.SECRET), {
        expiresIn: 60 * 60 * 4,
    });
    return res
        .status(200)
        .send(Object.assign(Object.assign({ message: "User signed in successfully" }, data), { token }));
});
exports.singin = singin;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, firstname, lastname } = req.body;
    yield db_1.default.transaction().execute((trx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield trx
                .insertInto("User")
                .values({ email: email, password: password, username: username })
                .returning(["id", "username", "email"])
                .executeTakeFirstOrThrow();
            yield trx
                .insertInto("Profile")
                .values({ firstname: firstname, lastname: lastname, userId: user.id })
                .executeTakeFirstOrThrow();
            const token = jsonwebtoken_1.default.sign({ id: user.id }, String(process.env.SECRET), {
                expiresIn: 60 * 60 * 4,
            });
            return res
                .status(200)
                .send(Object.assign(Object.assign({ message: "User signed up successfully" }, user), { token }));
        }
        catch (err) {
            return res.status(500).send(err);
        }
    }));
});
exports.signup = signup;
