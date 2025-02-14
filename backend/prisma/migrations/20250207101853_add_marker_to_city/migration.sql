-- CreateTable
CREATE TABLE "Marker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lat" DECIMAL NOT NULL,
    "lon" DECIMAL NOT NULL,
    "cityId" INTEGER NOT NULL,
    CONSTRAINT "Marker_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Marker_cityId_key" ON "Marker"("cityId");
