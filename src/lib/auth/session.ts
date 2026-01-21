import { SignJWT, jwtVerify } from 'jose';

type SessionData = {
  user: { id: string };
  expires: string;
};

const key = new TextEncoder().encode(process.env.AUTH_SECRET);

export async function verifyToken(input: string) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload as SessionData;
}
