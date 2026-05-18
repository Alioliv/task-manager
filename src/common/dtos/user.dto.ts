import { z } from "zod"

export const RegisterUserDto = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email(),
  password: z.string().min(8).max(72),
})

export const LoginUserDto = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const UpdateProfileDto = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
})

export const UpdatePasswordDto = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8).max(72),
    confirmPassword: z.string().min(1),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type RegisterUserDto = z.infer<typeof RegisterUserDto>
export type LoginUserDto = z.infer<typeof LoginUserDto>
export type UpdateProfileDto = z.infer<typeof UpdateProfileDto>
export type UpdatePasswordDto = z.infer<typeof UpdatePasswordDto>