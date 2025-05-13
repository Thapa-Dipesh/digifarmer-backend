import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient({
  log: ["query", "error"],
});

export default prisma;
