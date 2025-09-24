/*
  Warnings:

  - You are about to drop the column `categories` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "password" TEXT;

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "ratingAvg" REAL NOT NULL DEFAULT 0,
    "price" REAL,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "guests" INTEGER,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ReviewCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ReviewCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ReviewCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Review" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "source" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "propertyId" TEXT,
    "reviewType" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "authorName" TEXT,
    "language" TEXT,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Review_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("approved", "authorName", "body", "channel", "createdAt", "externalId", "id", "language", "listingId", "rating", "reviewType", "source", "title", "updatedAt") SELECT "approved", "authorName", "body", "channel", "createdAt", "externalId", "id", "language", "listingId", "rating", "reviewType", "source", "title", "updatedAt" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
CREATE INDEX "Review_listingId_createdAt_idx" ON "Review"("listingId", "createdAt");
CREATE INDEX "Review_source_createdAt_idx" ON "Review"("source", "createdAt");
CREATE INDEX "Review_propertyId_createdAt_idx" ON "Review"("propertyId", "createdAt");
CREATE UNIQUE INDEX "Review_externalId_source_key" ON "Review"("externalId", "source");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Property_slug_key" ON "Property"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ReviewCategories_AB_unique" ON "_ReviewCategories"("A", "B");

-- CreateIndex
CREATE INDEX "_ReviewCategories_B_index" ON "_ReviewCategories"("B");
