
const wol = require("wakeonlan");
class ClientManager {

    constructor() {

    this.clients = new Map();

    this.pcs = [
    {
        pcId: "PC-01",
        connected: false,
        macAddress: ""
    },
    {
        pcId: "PC-02",
        connected: false,
        macAddress: ""
    },
    {
        pcId: "PC-03",
        connected: false,
        macAddress: ""
    },
    {
        pcId: "PC-04",
        connected: false,
        macAddress: ""
    },
    {
        pcId: "PC-05",
        connected: false,
        macAddress: ""
    }
];

}

    register(pcId, socket) {

    this.clients.set(pcId, socket);

    const pc = this.pcs.find(p => p.pcId === pcId);

    if (pc) {
        pc.connected = true;
    }

    console.log(`${pcId} registered successfully.`);
    console.log(`Connected PCs: ${this.clients.size}`);

}

unregister(pcId) {

    this.clients.delete(pcId);

    const pc = this.pcs.find(p => p.pcId === pcId);

    if (pc) {
        pc.connected = false;
    }

    console.log(`${pcId} disconnected.`);
    console.log(`Connected PCs: ${this.clients.size}`);

}

    lock(pcId) {

    const socket = this.clients.get(pcId);

    if (!socket) {

        console.log(`${pcId} is not connected.`);
        return;

    }

    const message = {
        Type: "LOCK"
    };

    socket.send(JSON.stringify(message));

    console.log(`LOCK command sent to ${pcId}`);

}
    unlock(pcId) {

    const socket = this.clients.get(pcId);

    if (!socket) {

        console.log(`${pcId} is not connected.`);
        return;

    }

    const message = {
        Type: "UNLOCK"
    };

    socket.send(JSON.stringify(message));

    console.log(`UNLOCK command sent to ${pcId}`);

    

}
    getConnectedPcs() {

    return this.pcs;

}

    sendCommand(pcId, command) {

    const ws = this.clients.get(pcId);

    if (!ws) {
        console.log(`PC ${pcId} is not connected.`);
        return false;
    }

    ws.send(JSON.stringify({
        Type: command
    }));

    console.log(`Sent ${command} command to ${pcId}`);

    return true;
}

async wakePc(pcId) {

    const pc = this.pcs.find(p => p.pcId === pcId);

    if (!pc) {
        console.log(`PC ${pcId} not found.`);
        return false;
    }

    if (!pc.macAddress) {
        console.log(`No MAC address configured for ${pcId}.`);
        return false;
    }

    try {

        await wol(pc.macAddress);

        console.log(`Wake packet sent to ${pcId}.`);

        return true;

    } catch (error) {

        console.error(`Failed to wake ${pcId}:`, error);

        return false;

    }

}

}

module.exports = ClientManager;