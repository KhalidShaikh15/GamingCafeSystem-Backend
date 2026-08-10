const bcrypt = require("bcryptjs");
const prisma = require("./DatabaseService");

class OwnerAuthService {

    async setup(password) {

        if (!password || password.length < 4) {
            throw new Error(
                "Owner password must be at least 4 characters."
            );
        }

        const existing =
            await prisma.ownerAuth.findUnique({
                where: {
                    id: 1
                }
            });

        if (existing) {
            throw new Error(
                "Owner authentication is already configured."
            );
        }

        const passwordHash =
            await bcrypt.hash(password, 12);

        const ownerAuth =
            await prisma.ownerAuth.create({
                data: {
                    id: 1,
                    passwordHash
                }
            });

        return {
            id: ownerAuth.id,
            configured: true
        };

    }


    async isConfigured() {

        const ownerAuth =
            await prisma.ownerAuth.findUnique({
                where: {
                    id: 1
                }
            });

        return Boolean(ownerAuth);

    }


    async verify(password) {

        if (!password) {
            return false;
        }

        const ownerAuth =
            await prisma.ownerAuth.findUnique({
                where: {
                    id: 1
                }
            });

        if (!ownerAuth) {
            throw new Error(
                "Owner authentication is not configured."
            );
        }

        return await bcrypt.compare(
            password,
            ownerAuth.passwordHash
        );

    }

}

module.exports = OwnerAuthService;