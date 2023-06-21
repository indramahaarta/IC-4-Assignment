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
exports.updateArticle = exports.deleteArticle = exports.getArticle = exports.createArticle = void 0;
const postgres_1 = require("kysely/helpers/postgres");
const db_1 = __importDefault(require("../config/db"));
const createArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, tags, } = req.body;
    try {
        const transaction = yield db_1.default.transaction().execute((trx) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const article = yield trx
                    .insertInto("Article")
                    .values({
                    title: title,
                    content: content,
                    creatorId: Number(req.userId),
                })
                    .returningAll()
                    .executeTakeFirstOrThrow();
                tags.map((tag) => __awaiter(void 0, void 0, void 0, function* () {
                    let tagData = yield db_1.default
                        .selectFrom("Tag")
                        .where("Tag.name", "=", tag)
                        .selectAll()
                        .executeTakeFirst();
                    if (!tagData) {
                        tagData = yield db_1.default
                            .insertInto("Tag")
                            .values({ name: tag })
                            .returningAll()
                            .executeTakeFirstOrThrow();
                    }
                    yield db_1.default
                        .insertInto("ArticleOnTag")
                        .values({ articleId: article.id, tagId: tagData.id })
                        .execute();
                }));
                return article;
            }
            catch (err) {
                return res.status(500).send(err);
            }
        }));
        return res.status(201).send({
            message: "Article posted succesfully",
            article: Object.assign(Object.assign({}, transaction), { tag: tags }),
        });
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.createArticle = createArticle;
const getArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { creatorId } = req.query;
    let query = db_1.default
        .selectFrom("Article")
        .select((eb) => [
        "Article.id",
        "Article.title",
        "Article.content",
        "Article.createdAt",
        "Article.updatedAt",
        eb
            .selectFrom("User")
            .select("User.username")
            .whereRef("Article.creatorId", "=", "User.id")
            .limit(1)
            .as("creator"),
        (0, postgres_1.jsonArrayFrom)(eb
            .selectFrom("Tag")
            .select(["Tag.name"])
            .leftJoin("ArticleOnTag", "ArticleOnTag.tagId", "Tag.id")
            .whereRef("ArticleOnTag.articleId", "=", "Article.id")).as("tags"),
    ])
        .innerJoin("ArticleOnTag", "ArticleOnTag.articleId", "articleId");
    if (creatorId) {
        query = query.where("Article.creatorId", "=", Number(creatorId));
    }
    return res.status(200).send((yield query
        .groupBy("Article.id")
        .orderBy("Article.createdAt", "desc")
        .execute()).map((val) => {
        return Object.assign(Object.assign({}, val), { tags: val.tags.map((tag) => tag.name) });
    }));
});
exports.getArticle = getArticle;
const deleteArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { articleId } = req.body;
    try {
        const article = yield db_1.default
            .selectFrom("Article")
            .where("Article.id", "=", Number(articleId))
            .selectAll()
            .executeTakeFirst();
        if (!article) {
            return res.status(404).send({ message: "Article not found" });
        }
        if ((article === null || article === void 0 ? void 0 : article.creatorId) !== req.userId) {
            return res.status(401).send({ message: "You can't perform this action" });
        }
        yield db_1.default
            .deleteFrom("Article")
            .where("Article.id", "=", Number(articleId))
            .executeTakeFirstOrThrow();
        return res.status(200).send({ message: "Article deleted successfully" });
    }
    catch (err) {
        return res.status(500).send(err);
    }
});
exports.deleteArticle = deleteArticle;
const updateArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { articleId, title, content } = req.body;
    yield db_1.default.transaction().execute((trx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let article = yield db_1.default
                .selectFrom("Article")
                .selectAll()
                .where("Article.id", "=", articleId)
                .executeTakeFirst();
            if (!article) {
                return res.status(404).send({ message: "Article not found" });
            }
            if (article.creatorId != (req === null || req === void 0 ? void 0 : req.userId)) {
                return res
                    .status(401)
                    .send({ message: "You can't perform this action" });
            }
            article = yield trx
                .updateTable("Article")
                .set({
                title: title,
                content: content,
            })
                .where("Article.id", "=", articleId)
                .returningAll()
                .executeTakeFirstOrThrow();
            return res.status(201).send({
                message: "Article updated successfully",
                article: Object.assign({}, article),
            });
        }
        catch (err) {
            return res.status(500).send(err);
        }
    }));
});
exports.updateArticle = updateArticle;
