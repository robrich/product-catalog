
export type User = {
  id: number;
  email: string;
}
export type JwtPayload = User & {
  exp: number;
  iat: number;
}
