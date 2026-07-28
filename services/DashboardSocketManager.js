class DashboardSocketManager {

    constructor() {

        this.clients = new Set();

    }

    register(socket) {

        this.clients.add(socket);

        console.log(
            `Dashboard Connected (${this.clients.size})`
        );

    }

    unregister(socket) {

        this.clients.delete(socket);

        console.log(
            `Dashboard Disconnected (${this.clients.size})`
        );

    }
    notifyPcsUpdated() {

    this.broadcast({
        Type: "PCS_UPDATED"
    });

    }

    broadcast(data) {

        const message = JSON.stringify(data);

        for (const client of this.clients) {

            if (client.readyState === 1) {

                client.send(message);

            }

        }

    }

}

module.exports = DashboardSocketManager;