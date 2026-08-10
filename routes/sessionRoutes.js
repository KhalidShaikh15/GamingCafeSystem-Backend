const { requireOwnerAuth } = require("../middleware/ownerAuthMiddleware");

const express = require("express");


function createSessionRoutes(gameController) {
    const router = express.Router();

    router.use(express.json());

    router.post("/start-session", async (req, res) => {

        try {

            const { pcId, durationMinutes } = req.body;

            console.log(`Dashboard requested session for ${pcId}`);

            await gameController.startSession(
                pcId,
                durationMinutes
            );

            res.json({
                success: true
            });

        } catch (error) {

            console.error("Failed to start session:", error);

            res.status(500).json({
                success: false,
                error: error.message
            });

        }

    });


    router.post("/end-session", async (req, res) => {

        try {

            const { pcId } = req.body;

            console.log(`Dashboard requested end session for ${pcId}`);

            await gameController.endSession(pcId);

            res.json({
                success: true
            });

        } catch (error) {

            console.error("Failed to end session:", error);

            res.status(500).json({
                success: false,
                error: error.message
            });

        }

    });


    router.post("/extend-session", (req, res) => {

        try {

            const { pcId, durationMinutes } = req.body;

            console.log(
                `Dashboard requested extension for ${pcId}`
            );

            gameController.extendSession(
                pcId,
                durationMinutes
            );

            res.json({
                success: true
            });

        } catch (error) {

            console.error(
                "Failed to extend session:",
                error
            );

            res.status(500).json({
                success: false,
                error: error.message
            });

        }

    });


    router.post("/restart", (req, res) => {

        try {

            const { pcId } = req.body;

            const success =
                gameController.restartPc(pcId);

            res.json({
                success
            });

        } catch (error) {

            console.error(
                "Failed to restart PC:",
                error
            );

            res.status(500).json({
                success: false,
                error: error.message
            });

        }

    });


    router.post("/shutdown", (req, res) => {

        try {

            const { pcId } = req.body;

            const success =
                gameController.shutdownPc(pcId);

            res.json({
                success
            });

        } catch (error) {

            console.error(
                "Failed to shutdown PC:",
                error
            );

            res.status(500).json({
                success: false,
                error: error.message
            });

        }

    });


    router.post("/wake", async (req, res) => {

        try {

            const { pcId } = req.body;

            const success =
                await gameController.wakePc(pcId);

            res.json({
                success
            });

        } catch (error) {

            console.error(
                "Failed to wake PC:",
                error
            );

            res.status(500).json({
                success: false,
                error: error.message
            });

        }

    });


    router.get("/pending-payments", async (req, res) => {

        try {

            const payments =
                await gameController.getPendingPayments();

            res.json(payments);

        } catch (error) {

            console.error(
                "Failed to get pending payments:",
                error
            );

            res.status(500).json({
                success: false,
                error: error.message
            });

        }

    });

    router.get(
    "/paid-sessions",
    requireOwnerAuth,
    async (req, res) => {

    try {

        const sessions =
            await gameController.getPaidSessions();

        res.json(sessions);

    } catch (error) {

        console.error(
            "Failed to get paid sessions:",
            error
        );

        res.status(500).json({
            error: "Failed to get paid sessions"
        });

    }

});


    // Collect payment
    router.post("/collect-payment", async (req, res) => {

        try {

            const { sessionId } = req.body;

            console.log(
                `Collecting payment for session ${sessionId}`
            );

            await gameController.collectPayment(
                sessionId
            );

            res.json({
                success: true
            });

        } catch (error) {

            console.error(
                "Failed to collect payment:",
                error
            );

            res.status(500).json({
                success: false,
                error: error.message
            });

        }

    });


    return router;
}

module.exports = createSessionRoutes;