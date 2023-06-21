import express, { Express } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import logger from "./utils/logger";
import userRouter from "./routes/user.router";
import bodyParser from "body-parser";
import articleRouter from "./routes/article.router";
import { swaggerDocs } from "./utils/swagger";

dotenv.config();
const app: Express = express();
const port = Number(process.env.APP_PORT);
app.use(morgan("tiny"));
app.use(bodyParser.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/articles", articleRouter);

app.listen(port, () => {
  swaggerDocs(app);
  logger.info(`Application started on port ${port}`);
});
