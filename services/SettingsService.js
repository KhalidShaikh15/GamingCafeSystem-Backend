const prisma = require("./DatabaseService");

class SettingsService {

    async getSettings() {

        let settings = await prisma.setting.findUnique({
            where: {
                id: 1
            }
        });

        // First time the app runs
        if (!settings) {

            settings = await prisma.setting.create({
                data: {
                    id: 1
                }
            });

        }

        return settings;

    }

    async updateSettings(data) {

        return await prisma.setting.update({
            where: {
                id: 1
            },
            data
        });

    }

}

module.exports = SettingsService;