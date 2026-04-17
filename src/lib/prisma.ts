import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

globalForPrisma.prisma = prisma;

// Retry wrapper for transient DB connection failures (common in serverless cold starts)
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 300
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastError = err;
      const isTransient =
        err instanceof Error &&
        (err.message.includes("Can't reach database") ||
          err.message.includes("Connection refused") ||
          err.message.includes("Connection reset") ||
          err.message.includes("timeout") ||
          err.message.includes("ECONNRESET") ||
          err.message.includes("42P05") ||   // pgbouncer: prepared statement already exists
          err.message.includes("P1001") ||
          err.message.includes("P1008") ||
          err.message.includes("P1017"));
      if (!isTransient || attempt === retries) break;
      await new Promise((r) => setTimeout(r, delayMs * attempt));
    }
  }
  throw lastError;
}
