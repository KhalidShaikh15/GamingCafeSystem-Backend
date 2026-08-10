const express = require("express");
const jwt = require("jsonwebtoken");

const OwnerAuthService = require("../services/OwnerAuthService");
const {
    JWT_SECRET
} = require("../middleware/ownerAuthMiddleware");

function createOwnerAuthRoutes() {

    const router = express.Router();

    const ownerAuthService =
        new OwnerAuthService();


    router.get(
        "/owner-auth/status",
        async (req, res) => {

            try {

                const configured =
                    await ownerAuthService.isConfigured();

                res.json({
                    configured
                });

            } catch (error) {

                console.error(
                    "Failed to check owner auth status:",
                    error
                );

                res.status(500).json({
                    error:
                        "Failed to check owner authentication"
                });

            }

        }
    );


    router.post(
        "/owner-auth/setup",
        async (req, res) => {

            try {

                const { password } = req.body;

                const result =
                    await ownerAuthService.setup(
                        password
                    );

                res.status(201).json(result);

            } catch (error) {

                console.error(
                    "Failed to setup owner authentication:",
                    error
                );

                res.status(400).json({
                    error: error.message
                });

            }

        }
    );


    router.post(
        "/owner-auth/login",
        async (req, res) => {

            try {

                const { password } = req.body;

                const valid =
                    await ownerAuthService.verify(
                        password
                    );

                if (!valid) {

                    return res.status(401).json({
                        authenticated: false,
                        error:
                            "Invalid owner password"
                    });

                }

                const token =
                    jwt.sign(
                        {
                            role: "OWNER"
                        },
                        JWT_SECRET,
                        {
                            expiresIn: "8h"
                        }
                    );

                res.json({
                    authenticated: true,
                    token
                });

            } catch (error) {

                console.error(
                    "Owner authentication failed:",
                    error
                );

                res.status(500).json({
                    authenticated: false,
                    error: error.message
                });

            }

        }
    );


    return router;
}

module.exports = createOwnerAuthRoutes;