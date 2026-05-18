import * as crypto from "node:crypto";
import * as jwt from "jsonwebtoken";

import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../common/errors";
import {
  LoginUserDto,
  RegisterUserDto,
  UpdatePasswordDto,
  UpdateProfileDto,
} from "../common/dtos/user.dto";
import {
  UserRepository,
  userRepository,
} from "../repositories/user.repository";

const JWT_SECRET = process.env["JWT_SECRET"];
if (!JWT_SECRET) throw new Error("JWT_SECRET env var is required");

export class UserService {
  constructor(private readonly repository: UserRepository) {
    this.repository = userRepository;
  }

  async register(body: unknown) {
    const data = RegisterUserDto.parse(body);

    const existing = await this.repository.findByEmail(data.email);
    if (existing) throw new ConflictError("Email already in use");

    return this.repository.create({
      ...(data.name !== undefined && { name: data.name }),
      email: data.email,
      passwordHash: this.hashPassword(data.password),
    });
  }

  async login(body: unknown) {
    const data = LoginUserDto.parse(body);

    const user = await this.repository.findByEmail(data.email);
    const valid = user?.password === this.hashPassword(data.password);

    if (!user || !valid) throw new UnauthorizedError("Invalid credentials");

    const roles = user.userRoles.map((ur) => ur.role.name);
    const token = jwt.sign({ sub: user.id, roles }, JWT_SECRET!, {
      expiresIn: "7d",
    });

    return { token };
  }

  async getMe(id: number) {
    const user = await this.repository.findById(id);
    if (!user) throw new NotFoundError("User not found");
    return user;
  }

  async updateProfile(id: number, body: unknown) {
    const data = UpdateProfileDto.parse(body);

    if (data.email) {
      const existing = await this.repository.findByEmail(data.email);
      if (existing && existing.id !== id)
        throw new ConflictError("Email already in use");
    }

    return this.repository.update(id, data);
  }

  async updatePassword(id: number, body: unknown) {
    const data = UpdatePasswordDto.parse(body);

    const me = await this.repository.findById(id);
    const user = me ? await this.repository.findByEmail(me.email) : null;

    if (!user || user.password !== this.hashPassword(data.currentPassword)) {
      throw new UnauthorizedError("Current password is incorrect");
    }

    await this.repository.updatePassword(
      id,
      this.hashPassword(data.newPassword),
    );
  }

  async listAll() {
    return this.repository.findAll();
  }

  async deleteUser(id: number) {
    const user = await this.repository.findById(id);
    if (!user) throw new NotFoundError("User not found");
    await this.repository.delete(id);
  }

  private hashPassword(password: string): string {
    return crypto.createHash("sha256").update(password).digest("hex");
  }
}

export const userService = new UserService(userRepository);
