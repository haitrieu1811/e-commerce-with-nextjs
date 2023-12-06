import * as z from "zod";

const userSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Vui lòng nhập email",
    })
    .email("Email không đúng định dạng"),
  password: z
    .string()
    .min(6, {
      message: "Mật khẩu dài tối thiểu 6 ký tự",
    })
    .max(32, {
      message: "Mật khẩu dài tối đa 32 ký tự",
    }),
  confirm_password: z.string(),
});

export const registerSchema = userSchema
  .pick({
    email: true,
    password: true,
  })
  .extend({
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Nhập lại mật khẩu không chính xác",
    path: ["confirm_password"],
  });

export const loginSchema = userSchema.pick({
  email: true,
  password: true,
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
