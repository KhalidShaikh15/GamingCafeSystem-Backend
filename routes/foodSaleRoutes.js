const express = require("express");
const FoodSaleService = require("../services/FoodSaleService");

function createFoodSaleRoutes() {
    const router = express.Router();

    const foodSaleService = new FoodSaleService();


    // Add a food item to a session
    router.post("/food-sales", async (req, res) => {

        try {

            const foodSale =
                await foodSaleService.addFoodSale(req.body);

            res.status(201).json(foodSale);

        } catch (error) {

            console.error(
                "Failed to add food sale:",
                error
            );

            res.status(400).json({
                error: error.message
            });

        }

    });


    // Get all food sales
    router.get("/food-sales", async (req, res) => {

        try {

            const foodSales =
                await foodSaleService.getAllFoodSales();

            res.json(foodSales);

        } catch (error) {

            console.error(
                "Failed to get all food sales:",
                error
            );

            res.status(500).json({
                error: "Failed to get food sales"
            });

        }

    });


    // Get food sales for one session
    router.get(
        "/food-sales/:sessionId",
        async (req, res) => {

            try {

                const foodSales =
                    await foodSaleService.getFoodSales(
                        req.params.sessionId
                    );

                res.json(foodSales);

            } catch (error) {

                console.error(
                    "Failed to get food sales:",
                    error
                );

                res.status(500).json({
                    error: "Failed to get food sales"
                });

            }

        }
    );


    // Delete a food item
    router.delete(
        "/food-sales/:id",
        async (req, res) => {

            try {

                const foodSale =
                    await foodSaleService.deleteFoodSale(
                        req.params.id
                    );

                res.json(foodSale);

            } catch (error) {

                console.error(
                    "Failed to delete food sale:",
                    error
                );

                res.status(400).json({
                    error: error.message
                });

            }

        }
    );


    return router;
}

module.exports = createFoodSaleRoutes;