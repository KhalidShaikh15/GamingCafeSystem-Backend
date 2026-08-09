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

            console.log(
                `An active session already exists for ${pcId}.`
            );

            return activeSession;

        }

        const newSession = await prisma.session.create({
            data: {
                pcId,
                startTime: new Date(),
                plannedMinutes
            }
        });

        console.log(
            "Created session:",
            newSession.id
        );

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

            console.log(
                `No active session found for ${pcId}.`
            );

            return;

        }

        const endTime = new Date();

        const actualMinutes = Math.ceil(
            (endTime - session.startTime) / 60000
        );

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

        console.log(
            `Session ${session.id} marked as PENDING_PAYMENT.`
        );

    }


    async getPendingPayments() {

        return await prisma.session.findMany({
            where: {
                status: "PENDING_PAYMENT"
            },
            orderBy: {
                endTime: "desc"
            },
            include: {
                foodSales: {
                    orderBy: {
                        createdAt: "asc"
                    }
                }
            }
        });

    }

    async getPaidSessions() {

    return await prisma.session.findMany({
        where: {
            status: "PAID"
        },
        orderBy: {
            paidAt: "desc"
        },
        include: {
            foodSales: {
                orderBy: {
                    createdAt: "asc"
                }
            }
        }
    });

}


    async collectPayment(sessionId) {

    const session = await prisma.session.findUnique({
        where: {
            id: Number(sessionId)
        },
        include: {
            foodSales: true
        }
    });

    if (!session) {
        throw new Error("Session not found");
    }

    if (session.status !== "PENDING_PAYMENT") {
        throw new Error(
            `Session ${sessionId} is not awaiting payment`
        );
    }

    const foodGrossTotal = session.foodSales.reduce(
        (total, sale) => {
            return total + sale.grossAmount;
        },
        0
    );

    const foodCommissionTotal = session.foodSales.reduce(
        (total, sale) => {
            return total + sale.commissionAmount;
        },
        0
    );

    const foodNetTotal = session.foodSales.reduce(
        (total, sale) => {
            return total + sale.netAmount;
        },
        0
    );

    const totalAmount =
        session.gamingCharge + foodGrossTotal;

    const paidAt = new Date();

    const updatedSession =
        await prisma.session.update({
            where: {
                id: session.id
            },
            data: {
                foodGrossTotal,
                foodCommissionTotal,
                foodNetTotal,
                totalAmount,
                paidAt,
                status: "PAID"
            },
            include: {
                foodSales: true
            }
        });

    console.log(
        `Payment collected for session ${sessionId}.`
    );

    console.log(
        `Final bill: ₹${totalAmount}`
    );

    console.log(
        `Food commission: ₹${foodCommissionTotal}`
    );

    return updatedSession;
}

}

module.exports = SessionService;