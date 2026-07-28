const Session = require("../models/Session");

class SessionManager {

    constructor() {

    this.sessions = new Map();

    this.onSessionExpired = null;

    }
    setSessionExpiredCallback(callback) {

    this.onSessionExpired = callback;

    }

    startSession(pcId, durationMinutes) {

    this.endSession(pcId);

    const session = new Session(pcId, durationMinutes);

    this.sessions.set(pcId, session);

    this.resetTimer(session);

    console.log(`Session started for ${pcId}`);
    console.log(`Duration: ${durationMinutes} minutes`);

    return session;
}

extendSession(pcId, durationMinutes) {

    const session = this.sessions.get(pcId);

    if (!session) {
        return null;
    }

    session.endTime = new Date(
        session.endTime.getTime() + durationMinutes * 60 * 1000
    );

    this.resetTimer(session);

    console.log(`Session extended for ${pcId}`);
    console.log(`Added ${durationMinutes} minutes`);
    console.log(`New end time: ${session.endTime}`);

    return session;
}

getSession(pcId) {
    return this.sessions.get(pcId) || null;
}

isSessionActive(pcId) {
    return this.sessions.has(pcId);
}
getRemainingMinutes(pcId) {

    const session = this.sessions.get(pcId);

    if (!session) {
        return null;
    }

    const remainingMilliseconds =
        session.endTime.getTime() - Date.now();

    if (remainingMilliseconds <= 0) {
        return 0;
    }

    return Math.ceil(remainingMilliseconds / (60 * 1000));

}

    endSession(pcId) {

    const session = this.sessions.get(pcId);

    if (!session) {
        console.log(`No active session found for ${pcId}`);
        return null;

    }

    this.clearTimer(session);

    this.sessions.delete(pcId);

    console.log(`Session ended for ${pcId}`);
    }

    createTimer(session) {

    const remainingTime =
        session.endTime.getTime() - Date.now();

    session.timeout = setTimeout(() => {

        this.endSession(session.pcId);

        if (this.onSessionExpired) {
            this.onSessionExpired(session.pcId);
        }

    }, remainingTime);

}
resetTimer(session) {

    this.clearTimer(session);

    this.createTimer(session);

}

clearTimer(session) {

    if (session?.timeout) {
        clearTimeout(session.timeout);
        session.timeout = null;
    }

}

}

module.exports = SessionManager;