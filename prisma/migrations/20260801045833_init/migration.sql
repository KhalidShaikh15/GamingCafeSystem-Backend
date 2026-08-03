-- CreateTable
CREATE TABLE "PC" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pcId" TEXT NOT NULL,
    "macAddress" TEXT NOT NULL,
    "connected" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "PC_pcId_key" ON "PC"("pcId");
