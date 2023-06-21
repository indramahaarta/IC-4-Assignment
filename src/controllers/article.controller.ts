import { Response } from "express";
import { CustomerRequest } from "../middleware/verifyToken";
import { jsonArrayFrom } from "kysely/helpers/postgres";

import db from "../config/db";

export const createArticle = async (req: CustomerRequest, res: Response) => {
  const {
    title,
    content,
    tags,
  }: { title: string; content: string; tags: string[] } = req.body;

  try {
    const transaction = await db.transaction().execute(async (trx) => {
      try {
        const article = await trx
          .insertInto("Article")
          .values({
            title: title,
            content: content,
            creatorId: Number(req.userId),
          })
          .returningAll()
          .executeTakeFirstOrThrow();

        tags.map(async (tag) => {
          let tagData = await db
            .selectFrom("Tag")
            .where("Tag.name", "=", tag)
            .selectAll()
            .executeTakeFirst();
          if (!tagData) {
            tagData = await db
              .insertInto("Tag")
              .values({ name: tag })
              .returningAll()
              .executeTakeFirstOrThrow();
          }

          await db
            .insertInto("ArticleOnTag")
            .values({ articleId: article.id, tagId: tagData.id })
            .execute();
        });

        return article;
      } catch (err) {
        return res.status(500).send(err);
      }
    });

    return res.status(201).send({
      message: "Article posted succesfully",
      article: { ...transaction, tag: tags },
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getArticle = async (req: CustomerRequest, res: Response) => {
  const { creatorId } = req.query;

  let query = db
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
      jsonArrayFrom(
        eb
          .selectFrom("Tag")
          .select(["Tag.name"])
          .leftJoin("ArticleOnTag", "ArticleOnTag.tagId", "Tag.id")
          .whereRef("ArticleOnTag.articleId", "=", "Article.id")
      ).as("tags"),
    ])
    .innerJoin("ArticleOnTag", "ArticleOnTag.articleId", "articleId");

  if (creatorId) {
    query = query.where("Article.creatorId", "=", Number(creatorId));
  }

  return res.status(200).send(
    (
      await query
        .groupBy("Article.id")
        .orderBy("Article.createdAt", "desc")
        .execute()
    ).map((val) => {
      return { ...val, tags: val.tags.map((tag) => tag.name) };
    })
  );
};

export const deleteArticle = async (req: CustomerRequest, res: Response) => {
  const { articleId } = req.body;

  try {
    const article = await db
      .selectFrom("Article")
      .where("Article.id", "=", Number(articleId))
      .selectAll()
      .executeTakeFirst();
    if (!article) {
      return res.status(404).send({ message: "Article not found" });
    }
    if (article?.creatorId !== req.userId) {
      return res.status(401).send({ message: "You can't perform this action" });
    }
    await db
      .deleteFrom("Article")
      .where("Article.id", "=", Number(articleId))
      .executeTakeFirstOrThrow();
    return res.status(200).send({ message: "Article deleted successfully" });
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const updateArticle = async (req: CustomerRequest, res: Response) => {
  const { articleId, title, content } = req.body;

  await db.transaction().execute(async (trx) => {
    try {
      let article = await db
        .selectFrom("Article")
        .selectAll()
        .where("Article.id", "=", articleId)
        .executeTakeFirst();

      if (!article) {
        return res.status(404).send({ message: "Article not found" });
      }

      if (article.creatorId != req?.userId) {
        return res
          .status(401)
          .send({ message: "You can't perform this action" });
      }

      article = await trx
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
        article: { ...article },
      });
    } catch (err) {
      return res.status(500).send(err);
    }
  });
};
