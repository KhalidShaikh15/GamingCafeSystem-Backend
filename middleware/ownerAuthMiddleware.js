const jwt = require("jsonwebtoken");

const JWT_SECRET =
    process.env.OWNER_AUTH_SECRET ||
    "change-this-secret-in-production";

function requireOwnerAuth(req, res, next) {

    const authHeader =
        req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: "Owner authentication required"
        });
    }

    const [scheme, token] =
        authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({
            error: "Invalid authentication format"
        });
    }

    try {

        const decoded =
            jwt.verify(
                token,
                JWT_SECRET
            );

        if (decoded.role !== "OWNER") {
            return res.status(403).json({
                error: "Owner access required"
            });
        }

        req.owner = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            error: "Invalid or expired owner authentication"
        });

    }

}

module.exports = {
    JWT_SECRET,
    requireOwnerAuth
};