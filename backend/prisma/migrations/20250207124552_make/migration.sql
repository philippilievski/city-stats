-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MarkerMetadata" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lat" DECIMAL NOT NULL,
    "lon" DECIMAL NOT NULL,
    "cityId" INTEGER,
    CONSTRAINT "MarkerMetadata_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_MarkerMetadata" ("cityId", "id", "lat", "lon") SELECT "cityId", "id", "lat", "lon" FROM "MarkerMetadata";
DROP TABLE "MarkerMetadata";
ALTER TABLE "new_MarkerMetadata" RENAME TO "MarkerMetadata";
CREATE UNIQUE INDEX "MarkerMetadata_cityId_key" ON "MarkerMetadata"("cityId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
