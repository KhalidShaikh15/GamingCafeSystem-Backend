const express = require("express");
const createSettingsRoutes = require("./routes/settingsRoutes");
const createFoodSettingsRoutes = require("./routes/foodSettingsRoutes");
const eventBus = require("./events/EventBus");
const DashboardSocketManager = require("./services/DashboardSocketManager");
const cors = require("cors");
const path = require("path");
const createSessionRoutes = require("./routes/sessionRoutes");
const createDashboardRoutes = require("./routes/dashboardRoutes");
const WebSocket = require("ws");
const GameController = require("./controllers/GameController");
const ClientManager = require("./services/ClientManager");
const PcRegistry = require("./services/PcRegistry");
const createFoodSaleRoutes = require("./routes/foodSaleRoutes");

const app = express();
app.use(cors());

app.use(express.json());
const PORT = 5000; 
const pcRegistry = new PcRegistry(); 
const clientManager = new ClientManager(pcRegistry);
const dashboardSocketManager = new DashboardSocketManager();
eventBus.on("pcsUpdated", () => {

    console.log("Broadcasting dashboard update...");

    dashboardSocketManager.notifyPcsUpdated();

});
const SessionManager = require("./services/SessionManager");
const sessionManager = new SessionManager();
const gameController = new GameController(
    clientManager,
    sessionManager
);
sessionManager.setSessionExpiredCallback((pcId) => {
    gameController.endSession(pcId);
});
app.use(express.static(path.join(__dirname, "public")));
app.use(createDashboardRoutes(gameController));
app.use(createSessionRoutes(gameController));
app.use(createSettingsRoutes());
app.use(createFoodSettingsRoutes());
app.use(createFoodSaleRoutes());

const server = app.listen(PORT, () => {

    console.log("===================================");
    console.log("       Gaming Cafe Backend");
    console.log("===================================");
    console.log();

    console.log("Backend Started...");
    console.log(`Listening on Port ${PORT}`);

});

const wss = new WebSocket.Server({
    server
});

wss.on("connection", (socket) => {

    console.log();
    console.log("A WebSocket Client Connected!");

    socket.on("message", (message) => {

        const data = JSON.parse(message.toString());
        console.log("Received:", data);

        if (data.Type === "REGISTER") {

            clientManager.register(data.PcId, socket);

            clientManager.lock(data.PcId);

        }
        else if (data.Type === "DASHBOARD_REGISTER") {

            dashboardSocketManager.register(socket);

        }
        

    });

    socket.on("close", () => {

    dashboardSocketManager.unregister(socket);

    for (const [pcId, ws] of clientManager.clients.entries()) {

        if (ws === socket) {
            clientManager.unregister(pcId);
            break;
        }

    }

});

});