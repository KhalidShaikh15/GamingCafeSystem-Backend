const prisma = require("../services/DatabaseService");

async function main() {

    await prisma.pC.create({
        data: {
            pcId: "PC-01",
            macAddress: "",
            connected: false
        }
    });

    const pcs = await prisma.pC.findMany();

    console.log(pcs);

}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });