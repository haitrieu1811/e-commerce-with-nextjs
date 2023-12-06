import * as z from "zod";

export const registerSchema = z.object({
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
});

export type RegisterSchema = z.infer<typeof registerSchema>;
