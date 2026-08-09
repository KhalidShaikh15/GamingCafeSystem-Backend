-- CreateTable
CREATE TABLE "FoodSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "businessModel" TEXT NOT NULL DEFAULT 'IN_HOUSE',
    "commissionType" TEXT NOT NULL DEFAULT 'PERCENTAGE',
    "commissionValue" REAL NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "FoodSale" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionId" INTEGER NOT NULL,
    "itemName" TEXT NOT NULL,
    "unitPrice" REAL NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "grossAmount" REAL NOT NULL,
    "commissionType" TEXT NOT NULL,
    "commissionValue" REAL NOT NULL,
    "commissionAmount" REAL NOT NULL,
    "netAmount" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FoodSale_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
