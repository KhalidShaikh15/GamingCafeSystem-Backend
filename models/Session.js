class Session {

    constructor(pcId, durationMinutes) {

        this.pcId = pcId;
        this.durationMinutes = durationMinutes;

        this.startTime = new Date();

        this.endTime = new Date(
            Date.now() + durationMinutes * 60 * 1000
        );

        this.timeout = null;

    }

}

module.exports = Session;