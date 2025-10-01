/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `EventType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EventType_url_key" ON "public"."EventType"("url");
