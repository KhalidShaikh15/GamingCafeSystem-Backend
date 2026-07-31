
const wol = require("wakeonlan");
class ClientManager {

    constructor(pcRegistry) {

    this.clients = new Map();

    this.pcRegistry = pcRegistry;

}

    register(pcId, socket) {

    this.clients.set(pcId, socket);

    this.pcRegistry.setConnected(pcId, true);

    console.log(`${pcId} registered successfully.`);
    console.log(`Connected PCs: ${this.clients.size}`);

}

unregister(pcId) {

    this.clients.delete(pcId);

    this.pcRegistry.setConnected(pcId, false);

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

    return this.pcRegistry.getAll();

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

    const pc = this.pcRegistry.get(pcId);

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