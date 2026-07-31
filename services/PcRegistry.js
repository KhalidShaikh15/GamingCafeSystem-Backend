class PcRegistry {

    constructor() {

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

    getAll() {
        return this.pcs;
    }

    get(pcId) {
        return this.pcs.find(pc => pc.pcId === pcId);
    }

    setConnected(pcId, connected) {

        const pc = this.get(pcId);

        if (pc) {
            pc.connected = connected;
        }

    }

}

module.exports = PcRegistry;