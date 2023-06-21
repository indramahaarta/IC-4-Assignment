import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Article = {
    id: Generated<number>;
    title: string;
    content: string;
    updatedAt: Generated<Timestamp>;
    createdAt: Generated<Timestamp>;
    creatorId: number;
};
export type ArticleOnTag = {
    articleId: number;
    tagId: number;
};
export type Profile = {
    id: Generated<number>;
    firstname: string;
    lastname: string;
    userId: number;
};
export type Tag = {
    id: Generated<number>;
    name: string;
};
export type User = {
    id: Generated<number>;
    email: string;
    username: string;
    password: string;
};
export type DB = {
    Article: Article;
    ArticleOnTag: ArticleOnTag;
    Profile: Profile;
    Tag: Tag;
    User: User;
};
