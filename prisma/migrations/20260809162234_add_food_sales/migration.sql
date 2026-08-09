-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pcId" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME,
    "plannedMinutes" INTEGER NOT NULL,
    "actualMinutes" INTEGER,
    "gamingCharge" REAL NOT NULL DEFAULT 0,
    "foodGrossTotal" REAL NOT NULL DEFAULT 0,
    "foodCommissionTotal" REAL NOT NULL DEFAULT 0,
    "foodNetTotal" REAL NOT NULL DEFAULT 0,
    "totalAmount" REAL NOT NULL DEFAULT 0,
    "paidAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE'
);
INSERT INTO "new_Session" ("actualMinutes", "endTime", "gamingCharge", "id", "pcId", "plannedMinutes", "startTime", "status") SELECT "actualMinutes", "endTime", "gamingCharge", "id", "pcId", "plannedMinutes", "startTime", "status" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
