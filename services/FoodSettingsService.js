const prisma = require("./DatabaseService");

class FoodSettingsService {

    async getSettings() {

        let settings = await prisma.foodSettings.findUnique({
            where: {
                id: 1
            }
        });

        if (!settings) {

            settings = await prisma.foodSettings.create({
                data: {
                    id: 1,
                    businessModel: "IN_HOUSE",
                    commissionType: "PERCENTAGE",
                    commissionValue: 0
                }
            });

        }

        return settings;
    }

    async updateSettings(data) {

        return await prisma.foodSettings.update({
            where: {
                id: 1
            },
            data
        });

    }

}

module.exports = FoodSettingsService;