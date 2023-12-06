import { TokenType } from "@/constants/enum";

export type TokenPayload = {
  userId: string;
  role: string;
  tokenType: TokenType;
  iat: number;
  exp: number;
};
