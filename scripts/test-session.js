const prisma = require("../services/DatabaseService");

async function main() {

    const sessions = await prisma.session.findMany();

    console.log(sessions);

}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });