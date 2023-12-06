import { NextRequest, NextResponse } from "next/server";

import { registerSchema } from "@/app/rules/user.rules";
import { hashPassword } from "@/lib/crypto";
import prisma from "@/prisma/client";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = registerSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 422 });
  }
  const newUser = await prisma.user.create({
    data: {
      email: body.email,
      password: hashPassword(body.password),
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      phoneNumber: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return NextResponse.json(
    {
      message: "Đăng ký tài khoản thành công",
      data: {
        newUser,
      },
    },
    { status: 201 }
  );
}
