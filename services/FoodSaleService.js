const prisma = require("./DatabaseService");

class FoodSaleService {

    async addFoodSale({
        sessionId,
        itemName,
        unitPrice,
        quantity
    }) {

        if (!sessionId) {
            throw new Error("Session ID is required");
        }

        if (!itemName || !itemName.trim()) {
            throw new Error("Food item name is required");
        }

        if (unitPrice <= 0) {
            throw new Error("Food price must be greater than 0");
        }

        if (quantity <= 0) {
            throw new Error("Quantity must be greater than 0");
        }

        const session = await prisma.session.findUnique({
            where: {
                id: Number(sessionId)
            }
        });

        if (!session) {
            throw new Error("Session not found");
        }

        const foodSettings =
            await prisma.foodSettings.findUnique({
                where: {
                    id: 1
                }
            });

        const grossAmount = unitPrice * quantity;

        let commissionAmount = 0;

        let commissionType = "PERCENTAGE";
        let commissionValue = 0;

        if (foodSettings) {

            commissionType =
                foodSettings.commissionType;

            commissionValue =
                foodSettings.commissionValue;

            if (
                foodSettings.businessModel === "PARTNER"
            ) {

                if (
                    foodSettings.commissionType ===
                    "PERCENTAGE"
                ) {

                    commissionAmount =
                        grossAmount *
                        (foodSettings.commissionValue / 100);

                } else if (
                    foodSettings.commissionType ===
                    "FIXED"
                ) {

                    commissionAmount =
                        foodSettings.commissionValue *
                        quantity;

                }

            }

        }

        const netAmount =
            grossAmount - commissionAmount;

        const foodSale =
            await prisma.foodSale.create({
                data: {

                    sessionId: Number(sessionId),

                    itemName: itemName.trim(),

                    unitPrice,

                    quantity,

                    grossAmount,

                    commissionType,

                    commissionValue,

                    commissionAmount,

                    netAmount

                }
            });

        return foodSale;

    }

    async getFoodSales(sessionId) {

        return await prisma.foodSale.findMany({
            where: {
                sessionId: Number(sessionId)
            },
            orderBy: {
                createdAt: "asc"
            }
        });

    }

    async getAllFoodSales() {

    return await prisma.foodSale.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });

}

    async deleteFoodSale(foodSaleId) {

        return await prisma.foodSale.delete({
            where: {
                id: Number(foodSaleId)
            }
        });

    }

}

module.exports = FoodSaleService;