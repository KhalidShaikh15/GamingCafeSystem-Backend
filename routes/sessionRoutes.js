const express = require("express");

function createSessionRoutes(gameController) {

    const router = express.Router();

    router.use(express.json());

    router.post("/start-session", async (req, res) => {

    const { pcId, durationMinutes } = req.body;

    console.log(`Dashboard requested session for ${pcId}`);

    await gameController.startSession(pcId, durationMinutes);

    res.json({
        success: true
    });

});

    router.post("/end-session", async (req, res) => {

        const { pcId } = req.body;

        console.log(`Dashboard requested end session for ${pcId}`);

        await gameController.endSession(pcId);

        res.json({
            success: true
        });

    });

    router.post("/extend-session", (req, res) => {

    const { pcId, durationMinutes } = req.body;

    console.log(`Dashboard requested extension for ${pcId}`);

    gameController.extendSession(pcId, durationMinutes);

    res.json({
        success: true
    });

});

    router.post("/restart", (req, res) => {
    const { pcId } = req.body;

    const success = gameController.restartPc(pcId);

    res.json({ success });
});

router.post("/shutdown", (req, res) => {
    const { pcId } = req.body;

    const success = gameController.shutdownPc(pcId);

    res.json({ success });


});

router.post("/wake", async (req, res) => {

    const { pcId } = req.body;

    const success = await gameController.wakePc(pcId);

    res.json({ success });

});

router.get("/pending-payments", async (req, res) => {

    const payments = await gameController.getPendingPayments();

    res.json(payments);

});


    return router;



}

module.exports = createSessionRoutes;