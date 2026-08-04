const prisma = require("../services/DatabaseService");

async function main() {

    await prisma.session.deleteMany();

    console.log("All sessions deleted.");

}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });