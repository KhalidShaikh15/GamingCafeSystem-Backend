const express = require("express");
const SettingsService = require("../services/SettingsService");

function createSettingsRoutes() {

    const router = express.Router();
    const settingsService = new SettingsService();

    router.use(express.json());

    router.get("/settings", async (req, res) => {

        const settings = await settingsService.getSettings();

        res.json(settings);

    });

    router.post("/settings", async (req, res) => {

        const settings = await settingsService.updateSettings(req.body);

        res.json(settings);

    });

    return router;

}

module.exports = createSettingsRoutes;