import { NextRequest, NextResponse } from "next/server";

import { logoutSchema } from "@/app/rules/user.rules";
import prisma from "@/lib/prismaClient";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = logoutSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }
  const refreshToken = await prisma.refreshToken.findFirst({
    where: {
      token: body.refreshToken,
    },
  });
  if (!refreshToken) {
    return NextResponse.json(
      { message: "Không tìm thấy refresh token" },
      { status: 404 }
    );
  }
  await prisma.refreshToken.delete({
    where: {
      id: refreshToken.id,
    },
  });
  return NextResponse.json({
    message: "Đăng xuất thành công",
  });
}
