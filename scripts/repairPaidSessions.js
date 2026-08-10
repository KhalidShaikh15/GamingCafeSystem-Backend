const prisma = require("../services/DatabaseService");

async function repairPaidSessions() {

    console.log("===================================");
    console.log("   Repairing Paid Session Totals");
    console.log("===================================");
    console.log();

    const sessions = await prisma.session.findMany({
        where: {
            status: "PAID"
        },
        include: {
            foodSales: true
        },
        orderBy: {
            id: "asc"
        }
    });

    console.log(
        `Found ${sessions.length} paid sessions.`
    );

    console.log();

    for (const session of sessions) {

        /*
         * If the session already has a paidAt timestamp
         * and a totalAmount greater than zero, we assume
         * the new accounting data is already correct.
         */
        if (
            session.paidAt !== null &&
            session.totalAmount > 0
        ) {

            console.log(
                `Session ${session.id}: already repaired.`
            );

            continue;
        }

        const foodGrossTotal =
            session.foodSales.reduce(
                (total, sale) => {
                    return total + sale.grossAmount;
                },
                0
            );

        const foodCommissionTotal =
            session.foodSales.reduce(
                (total, sale) => {
                    return total + sale.commissionAmount;
                },
                0
            );

        const foodNetTotal =
            session.foodSales.reduce(
                (total, sale) => {
                    return total + sale.netAmount;
                },
                0
            );

        const totalAmount =
            session.gamingCharge +
            foodGrossTotal;

        /*
         * Old sessions don't have a paidAt timestamp.
         *
         * We use endTime as the best available historical
         * payment timestamp rather than inventing a date.
         */
        const paidAt =
            session.paidAt ||
            session.endTime ||
            session.startTime;

        await prisma.session.update({
            where: {
                id: session.id
            },
            data: {
                foodGrossTotal,
                foodCommissionTotal,
                foodNetTotal,
                totalAmount,
                paidAt
            }
        });

        console.log(
            `Session ${session.id} repaired:`
        );

        console.log(
            `  Gaming: ₹${session.gamingCharge}`
        );

        console.log(
            `  Food: ₹${foodGrossTotal}`
        );

        console.log(
            `  Commission: ₹${foodCommissionTotal}`
        );

        console.log(
            `  Café Revenue: ₹${foodNetTotal}`
        );

        console.log(
            `  Total: ₹${totalAmount}`
        );

        console.log();
    }

    console.log(
        "Paid session repair completed."
    );

}

repairPaidSessions()
    .catch((error) => {

        console.error(
            "Repair failed:",
            error
        );

        process.exit(1);

    })
    .finally(async () => {

        await prisma.$disconnect();

    });