/*
  Warnings:

  - You are about to drop the `Marker` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Marker";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "MarkerMetadata" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lat" DECIMAL NOT NULL,
    "lon" DECIMAL NOT NULL,
    "cityId" INTEGER NOT NULL,
    CONSTRAINT "MarkerMetadata_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "MarkerMetadata_cityId_key" ON "MarkerMetadata"("cityId");
