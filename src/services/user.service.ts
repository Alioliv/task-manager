import { ConflictError, NotFoundError, UnauthorizedError } from "../common/errors";
import { UpdatePasswordDto, UpdateProfileDto } from "../common/dtos/user.dto";
import { UserRepository, userRepository } from "../repositories/user.repository";
import { createHash, compareHash } from "../common/utils/hash"; 

export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async getMe(id: number) {
    const user = await this.repository.findById(id);
    if (!user) throw new NotFoundError("User not found");
    return user;
  }

  async updateProfile(id: number, body: UpdateProfileDto) {
    const data = UpdateProfileDto.parse(body);

    if (data.email) {
      const existing = await this.repository.findByEmail(data.email);
      if (existing && existing.id !== id)
        throw new ConflictError("Email already in use");
    }

    return this.repository.update(id, data);
  }

  async updatePassword(id: number, body: UpdatePasswordDto) {
    const data = UpdatePasswordDto.parse(body);

    const user = await this.repository.findById(id);
    if (!user) throw new NotFoundError("User not found");

    const validPassword = await compareHash(data.currentPassword, user.password || "");
    if (!validPassword) throw new UnauthorizedError("Current password is incorrect");

    const hash = await createHash(data.newPassword);
    await this.repository.updatePassword(id, hash);
  }

  async listAll() {
    return this.repository.findAll();
  }

  async deleteUser(id: number) {
    const user = await this.repository.findById(id);
    if (!user) throw new NotFoundError("User not found");
    await this.repository.delete(id);
  }

}

export const userService = new UserService(userRepository);
