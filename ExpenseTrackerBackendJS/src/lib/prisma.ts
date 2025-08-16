// src/lib/prisma.ts (or src/utils/prisma.ts)
import { PrismaClient } from '@prisma/client';

// Extend the global type definition to include your PrismaClient instance
// This is crucial for keeping a single instance across hot-reloads in development
declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;