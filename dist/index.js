"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = __importDefault(require("./utils/logger"));
const user_router_1 = __importDefault(require("./routes/user.router"));
const body_parser_1 = __importDefault(require("body-parser"));
const article_router_1 = __importDefault(require("./routes/article.router"));
const swagger_1 = require("./utils/swagger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT);
app.use((0, morgan_1.default)("tiny"));
app.use(body_parser_1.default.json());
app.use("/api/v1/users", user_router_1.default);
app.use("/api/v1/articles", article_router_1.default);
app.listen(port, () => {
    (0, swagger_1.swaggerDocs)(app);
    logger_1.default.info(`Application started on port ${port}`);
});
