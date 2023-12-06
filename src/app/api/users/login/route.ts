import { NextRequest, NextResponse } from "next/server";

import { loginSchema } from "@/app/rules/user.rules";
import { ENV_CONFIG } from "@/constants/config";
import { hashPassword } from "@/lib/crypto";
import { signToken } from "@/lib/jwt";
import prisma from "@/prisma/client";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = loginSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 422 });
  }
  const foundUser = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      phoneNumber: true,
      role: true,
      password: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!foundUser) {
    return NextResponse.json(
      { message: "Email không tồn tại trên hệ thống" },
      { status: 404 }
    );
  }
  if (foundUser.password !== hashPassword(body.password)) {
    return NextResponse.json(
      { message: "Mật khẩu không chính xác" },
      { status: 400 }
    );
  }
  const [accessToken, refreshToken] = await Promise.all([
    signToken({
      payload: { user_id: foundUser.id, role: foundUser.role },
      privateKey: ENV_CONFIG.ACCESS_TOKEN_SECRET,
      options: {
        expiresIn: ENV_CONFIG.ACCESS_TOKEN_EXPIRES_IN,
      },
    }),
    signToken({
      payload: { user_id: foundUser.id, role: foundUser.role },
      privateKey: ENV_CONFIG.REFRESH_TOKEN_SECRET,
      options: {
        expiresIn: ENV_CONFIG.REFRESH_TOKEN_EXPIRES_IN,
      },
    }),
  ]);
  return NextResponse.json({
    message: "Đăng nhập thành công",
    data: {
      accessToken,
      refreshToken,
      user: foundUser,
    },
  });
}
