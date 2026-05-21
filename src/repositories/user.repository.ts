import type { PrismaClient } from "../prisma/generated/prisma/client"
import { prisma } from "../prisma/prisma"
import type { UpdateProfileDto } from "../common/dtos/user.dto"
import type { Prisma } from "../prisma/generated/prisma/client"
import { RoleType } from "../prisma/generated/prisma/client"

const userSelect = {
  id: true,
  name: true,
  email: true,
} satisfies Prisma.UserSelect

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        userRoles: {
          select: { role: { select: { name: true } } },
        },
      },
    })
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    })
  }

  async findAll() {
    return this.prisma.user.findMany({select: userSelect})
  }

  async update(id: number, data: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...(data.name === undefined ? {} : { name: data.name }),
        ...(data.email === undefined ? {} : { email: data.email })
      }
    })
  }

  async updatePassword(id: number, passwordHash: string) {
    return this.prisma.user.update({
      where: { id },
      data: { password: passwordHash },
      select: { id: true },
    })
  }

  async delete(id: number) {
    return this.prisma.user.delete({ where: { id } })
  }

  async promoteToAdmin(id: number) {
  const adminRole = await this.prisma.role.findUnique({
    where: { name: RoleType.ADMIN }
  })
  if (!adminRole) throw new Error("Role ADMIN não encontrada")
  
  return this.prisma.userRole.create({
    data: {
      userId: id,
      roleId: adminRole.id
    }
  })
}
}

export const userRepository = new UserRepository(prisma)
