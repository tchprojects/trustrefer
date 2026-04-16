import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "toolsusepremium@gmail.com";
  const newPassword = "admin123";

  const hashed = await bcrypt.hash(newPassword, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashed, role: "SUPER_ADMIN" },
    create: {
      email,
      name: "TrustRefer Admin",
      password: hashed,
      role: "SUPER_ADMIN",
    },
  });

  console.log(`✅ Password reset for: ${user.email}`);
  console.log(`   Role: ${user.role}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
