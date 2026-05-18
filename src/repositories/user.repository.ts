import type { PrismaClient } from "../prisma/generated/prisma/client"
import { prisma } from "../prisma/prisma"
import type { UpdateProfileDto } from "../common/dtos/user.dto"

const userSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  userRoles: {
    select: { role: { select: { name: true } } },
  },
} as const

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma
  }

  async create(data: {
    name?: string
    email: string
    passwordHash: string
  }) {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.passwordHash,
        userRoles: {
          create: { role: { connect: { name: "MEMBER" } } },
        },
      },
      select: userSelect,
    })
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
      select: userSelect,
    })
  }

  async findAll() {
    return this.prisma.user.findMany({ select: userSelect })
  }

  async update(id: number, data: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: userSelect,
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
}

export const userRepository = new UserRepository(prisma)