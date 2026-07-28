const express = require("express");

function createDashboardRoutes(gameController) {

    const router = express.Router();

    router.get("/pcs", (req, res) => {

        res.json(gameController.getDashboardPcs());

    });

    return router;
}

module.exports = createDashboardRoutes;