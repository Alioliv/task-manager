import { prisma } from "../src/prisma/prisma"
import type { RoleType } from "../src/prisma/generated/prisma/client"

const roles: RoleType[] = ["ADMIN", "MEMBER"]

async function main() {
  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }
  console.log("Roles seeded.")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())