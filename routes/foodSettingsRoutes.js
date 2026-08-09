const express = require("express");
const FoodSettingsService = require("../services/FoodSettingsService");

function createFoodSettingsRoutes() {

    const router = express.Router();

    const foodSettingsService = new FoodSettingsService();

    router.get("/food-settings", async (req, res) => {

        try {

            const settings = await foodSettingsService.getSettings();

            res.json(settings);

        } catch (error) {

            console.error("Failed to get food settings:", error);

            res.status(500).json({
                error: "Failed to get food settings"
            });

        }

    });

    router.post("/food-settings", async (req, res) => {

        try {

            const settings =
                await foodSettingsService.updateSettings(req.body);

            res.json(settings);

        } catch (error) {

            console.error("Failed to update food settings:", error);

            res.status(500).json({
                error: "Failed to update food settings"
            });

        }

    });

    return router;
}

module.exports = createFoodSettingsRoutes;