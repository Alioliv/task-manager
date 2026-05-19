import type { User } from "../prisma/generated/prisma/client";
import { RoleType } from "../prisma/generated/prisma/client";

import { AuthRepository, authRepository } from "../repositories/auth.repository";

import { ConflictError } from "../common/errors";
import { LoginUserDto, RegisterUserDto } from "../common/dtos/user.dto";

import { createHash } from "../common/utils/hash";
import { signTokenAcess, signTokenRefresh } from "../common/utils/jwt";

import bcrypt from "bcrypt";

export class AuthService {
  constructor(private readonly repository: AuthRepository) {}

  async register(dataUser: User) {
    const data = RegisterUserDto.parse(dataUser);

    const existing = await this.repository.existUser(data.email);
    if (existing) throw new ConflictError("Email already in use");

    const hash = await createHash(data.password);

    const userCreated = await this.repository.register(
      {
        name: data.name ?? null,
        email: data.email,
        password: hash,
      },
      RoleType.MEMBER,
    );

    return userCreated;
  }

  async registerAdmin(dataUser: User) {
    const data = RegisterUserDto.parse(dataUser);
    const hash = await createHash(data.password);

    return await this.repository.register(
      {
        name: data.name ?? null,
        email: data.email,
        password: hash,
      },
      RoleType.ADMIN,
    );
  }

  async login(dataUser: Partial<User>) {
    const data = LoginUserDto.parse(dataUser); 

    const existUser = await this.repository.existUser(data.email);

    const validCredentials = await bcrypt.compare(
      data.password || "",
      existUser?.password || "",
    );

    if (!existUser || !validCredentials) {
      throw new Error("Credenciais inválidas");
    }

    const roles = existUser.userRoles.map((ur) => ur.role.name);

    const tokenAccess = signTokenAcess({
      id: existUser.id,
      email: existUser.email,
      name: existUser.name,
      role: roles,
    });

    const tokenRefresh = signTokenRefresh({
      id: existUser.id,
      email: existUser.email,
      name: existUser.name,
      role: roles,
    });

    const accessExpires = new Date();
    accessExpires.setHours(accessExpires.getHours() + 1);

    await this.repository.createToken({
      token: tokenAccess,
      expiresAt: accessExpires,
      type: "ACCESS",
      userId: existUser.id,
    });

    const refreshExpires = new Date();
    refreshExpires.setMonth(refreshExpires.getMonth() + 1);

    await this.repository.createToken({
      token: tokenRefresh,
      expiresAt: refreshExpires,
      type: "REFRESH",
      userId: existUser.id,
    });

    return { tokenAccess, tokenRefresh };
  }
}

export const authService = new AuthService(authRepository);
