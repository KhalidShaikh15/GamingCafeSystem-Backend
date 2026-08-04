const prisma = require("./DatabaseService");

class SessionService {

    async create(pcId, plannedMinutes) {

        console.log("Creating session record...");

        const activeSession = await prisma.session.findFirst({
            where: {
                pcId,
                status: "ACTIVE"
            },
            orderBy: {
                startTime: "desc"
            }
        });

        console.log("Active session found:", activeSession);

        if (activeSession) {

            console.log(`An active session already exists for ${pcId}.`);

            return activeSession;

        }

        const newSession = await prisma.session.create({
            data: {
                pcId,
                startTime: new Date(),
                plannedMinutes
            }
        });

        console.log("Created session:", newSession.id);

        return newSession;

    }

    async end(pcId) {

        const session = await prisma.session.findFirst({
            where: {
                pcId,
                status: "ACTIVE"
            },
            orderBy: {
                startTime: "desc"
            }
        });

        if (!session) {

            console.log(`No active session found for ${pcId}.`);

            return;

        }

        const endTime = new Date();

        const actualMinutes = Math.ceil(
            (endTime - session.startTime) / 60000
        );

        // Temporary pricing: ₹2 per minute
        const gamingCharge = actualMinutes * 2;

        await prisma.session.update({
            where: {
                id: session.id
            },
            data: {
                endTime,
                actualMinutes,
                gamingCharge,
                status: "PENDING_PAYMENT"
            }
        });

        console.log(`Session ${session.id} marked as PENDING_PAYMENT.`);

    }

    async getPendingPayments() {

        return await prisma.session.findMany({
            where: {
                status: "PENDING_PAYMENT"
            },
            orderBy: {
                endTime: "desc"
            }
        });

    }

}

module.exports = SessionService;