import type { User, Token, PrismaClient } from "../prisma/generated/prisma/client";
import { prisma } from "../prisma/prisma";
import { RoleType } from "../prisma/generated/prisma";

export class AuthRepository {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async register(dataUser: Partial<User>, role: RoleType = RoleType.MEMBER) {
    return await this.prisma.user.create({
      data: {
        email: dataUser.email || "",
        password: dataUser.password || "",
        name: dataUser.name || "",
        userRoles: {
          create: {
            role: {
              connect: {
                name: role,
              },
            },
          },
        },
      },
    });
  }

  async existUser(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async createToken(dataToken: Omit<Token, "id" | "revoked" | "createdAt">) {
    return await this.prisma.token.create({
      data: dataToken,
    });
  }
}

export const authRepository = new AuthRepository(prisma);
