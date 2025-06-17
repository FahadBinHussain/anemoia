import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { prisma } from './db';
import dotenv from 'dotenv';
dotenv.config();
// import { User as PrismaUser } from '@prisma/client';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '7d';

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function verifyGoogleToken(token: string): Promise<any | null> {
  const ticket = await client.verifyIdToken({ idToken: token, audience: GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();
  if (!payload) return null;
  return {
    id: payload.sub!,
    name: payload.name!,
    email: payload.email!,
    avatar_url: payload.picture!,
    given_name: payload.given_name ?? undefined,
    family_name: payload.family_name ?? undefined,
  };
}

export async function findOrCreateUser(user: any): Promise<any> {
  console.log('[findOrCreateUser] Input:', user);
  try {
    const result = await prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
        given_name: user.given_name,
        family_name: user.family_name,
      },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
        given_name: user.given_name,
        family_name: user.family_name,
      },
    });
    console.log('[findOrCreateUser] Upsert result:', result);
    return result;
  } catch (err) {
    console.error('[findOrCreateUser] Prisma error:', err);
    throw err;
  }
}

export function issueJWT(user: any) {
  return jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyJWT(token: string): string | jwt.JwtPayload {
  return jwt.verify(token, JWT_SECRET);
} 