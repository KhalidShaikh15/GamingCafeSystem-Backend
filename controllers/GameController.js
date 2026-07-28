const eventBus = require("../events/EventBus");
class GameController {

    constructor(clientManager, sessionManager) {

        this.clientManager = clientManager;
        this.sessionManager = sessionManager;

    }

    startSession(pcId, durationMinutes) {

    this.sessionManager.startSession(
        pcId,
        durationMinutes
    );

    this.clientManager.unlock(pcId);
    eventBus.emit("pcsUpdated");

}

    endSession(pcId) {

    console.log();
    console.log(`Session expired for ${pcId}`);

    this.sessionManager.endSession(pcId);

    this.clientManager.lock(pcId);
    eventBus.emit("pcsUpdated");

}
extendSession(pcId, durationMinutes) {

    this.sessionManager.extendSession(
        pcId,
        durationMinutes
    );

    eventBus.emit("pcsUpdated");

}
getDashboardPcs() {

    const pcs = this.clientManager.getConnectedPcs();

    return pcs.map(pc => {
        const active = this.sessionManager.isSessionActive(pc.pcId);
        const session = this.sessionManager.getSession(pc.pcId);
        let status = "offline";

        if (pc.connected) {
            status = active ? "active" : "locked";
        }

        return {

            pcId: pc.pcId,
            connected: pc.connected,
            status,

            endTime: session ? session.endTime : null

        };

    });

}

restartPc(pcId) {

    // End the current session first
    this.endSession(pcId);

    const sent = this.clientManager.sendCommand(
        pcId,
        "RESTART"
    );

    if (sent) {
        console.log(`Restart command sent to ${pcId}`);
    }

    return sent;
}

shutdownPc(pcId) {

    // End the current session first
    this.endSession(pcId);

    const sent = this.clientManager.sendCommand(
        pcId,
        "SHUTDOWN"
    );

    if (sent) {
        console.log(`Shutdown command sent to ${pcId}`);
    }

    return sent;
}

async wakePc(pcId) {

    const sent = await this.clientManager.wakePc(pcId);

    if (sent) {
        console.log(`Wake command sent to ${pcId}`);
    }

    return sent;

}

}

module.exports = GameController;