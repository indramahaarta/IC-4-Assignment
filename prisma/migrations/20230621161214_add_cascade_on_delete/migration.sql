-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "ArticleOnTag" DROP CONSTRAINT "ArticleOnTag_articleId_fkey";

-- DropForeignKey
ALTER TABLE "ArticleOnTag" DROP CONSTRAINT "ArticleOnTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleOnTag" ADD CONSTRAINT "ArticleOnTag_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleOnTag" ADD CONSTRAINT "ArticleOnTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
