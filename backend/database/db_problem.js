const prisma = require("./prisma");
const env = require("dotenv");

env.config();

const dbconnection = async () => {
    try {
        await prisma.$connect();
        console.log("Database connected (PostgreSQL with Prisma)");
    }
    catch (err) {
        console.error("Database connection error:", err);
    }
}

module.exports = dbconnection;
