import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { verifyGoogleToken, findOrCreateUser, issueJWT, verifyJWT } from './auth';
import { prisma } from './db';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Google login endpoint
app.post('/api/auth/google', (async function (req: Request, res: Response) {
  const { credential } = req.body;
  console.log('[POST /api/auth/google] credential:', credential);
  if (!credential) return res.status(400).json({ error: 'Missing credential' });
  try {
    const user = await verifyGoogleToken(credential);
    console.log('[POST /api/auth/google] user from Google:', user);
    if (!user) return res.status(401).json({ error: 'Invalid Google token' });
    const dbUser = await findOrCreateUser(user);
    const token = issueJWT(dbUser);
    console.log('[POST /api/auth/google] token:', token);
    res.json({ token, user: dbUser });
  } catch (e) {
    console.error('[POST /api/auth/google] error:', e);
    res.status(500).json({ error: 'Auth failed', details: e });
  }
}) as any);

// Session check endpoint
app.get('/api/auth/session', (async function (req: Request, res: Response) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.replace('Bearer ', '');
  try {
    const payload = verifyJWT(token) as any;
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (e) {
    res.status(401).json({ error: 'Invalid token', details: e });
  }
}) as any);

// (Optional) Logout endpoint
app.post('/api/auth/logout', (function (req: Request, res: Response) {
  // For JWT, logout is handled client-side by deleting the token
  res.json({ ok: true });
}) as any);

// --- User Follows ---
app.get('/api/user/follows', (async function (req: Request, res: Response) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.replace('Bearer ', '');
  try {
    const payload = verifyJWT(token) as any;
    const follows = await prisma.follow.findMany({
      where: { user_id: payload.sub },
      select: { artist_id: true }
    });
    res.json({ follows: follows.map((f: any) => f.artist_id) });
  } catch (e) {
    res.status(401).json({ error: 'Invalid token', details: e });
  }
}) as any);
app.post('/api/user/follows', (async function (req: Request, res: Response) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.replace('Bearer ', '');
  const { artist_id } = req.body;
  if (!artist_id) return res.status(400).json({ error: 'Missing artist_id' });
  try {
    const payload = verifyJWT(token) as any;
    await prisma.follow.create({ data: { user_id: payload.sub, artist_id } });
    res.json({ ok: true });
  } catch (e) {
    res.status(401).json({ error: 'Invalid token or already followed', details: e });
  }
}) as any);
app.delete('/api/user/follows', (async function (req: Request, res: Response) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.replace('Bearer ', '');
  const artist_id = req.body.artist_id || req.query.artist_id;
  if (!artist_id) return res.status(400).json({ error: 'Missing artist_id' });
  try {
    const payload = verifyJWT(token) as any;
    await prisma.follow.delete({ where: { user_id_artist_id: { user_id: payload.sub, artist_id } } });
    res.json({ ok: true });
  } catch (e) {
    res.status(401).json({ error: 'Invalid token or not followed', details: e });
  }
}) as any);
// --- User Likes ---
app.get('/api/user/likes', (async function (req: Request, res: Response) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.replace('Bearer ', '');
  try {
    const payload = verifyJWT(token) as any;
    const likes = await prisma.like.findMany({
      where: { user_id: payload.sub },
      select: { artwork_id: true }
    });
    res.json({ likes: likes.map((l: any) => l.artwork_id) });
  } catch (e) {
    res.status(401).json({ error: 'Invalid token', details: e });
  }
}) as any);
app.post('/api/user/likes', (async function (req: Request, res: Response) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.replace('Bearer ', '');
  const { artwork_id } = req.body;
  if (!artwork_id) return res.status(400).json({ error: 'Missing artwork_id' });
  try {
    const payload = verifyJWT(token) as any;
    await prisma.like.create({ data: { user_id: payload.sub, artwork_id } });
    res.json({ ok: true });
  } catch (e) {
    res.status(401).json({ error: 'Invalid token or already liked', details: e });
  }
}) as any);
app.delete('/api/user/likes', (async function (req: Request, res: Response) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.replace('Bearer ', '');
  const artwork_id = req.body.artwork_id || req.query.artwork_id;
  if (!artwork_id) return res.status(400).json({ error: 'Missing artwork_id' });
  try {
    const payload = verifyJWT(token) as any;
    await prisma.like.delete({ where: { user_id_artwork_id: { user_id: payload.sub, artwork_id } } });
    res.json({ ok: true });
  } catch (e) {
    res.status(401).json({ error: 'Invalid token or not liked', details: e });
  }
}) as any);
// --- User Saved ---
app.get('/api/user/saved', (async function (req: Request, res: Response) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.replace('Bearer ', '');
  try {
    const payload = verifyJWT(token) as any;
    const saved = await prisma.saved.findMany({
      where: { user_id: payload.sub },
      select: { artwork_id: true }
    });
    res.json({ saved: saved.map((s: any) => s.artwork_id) });
  } catch (e) {
    res.status(401).json({ error: 'Invalid token', details: e });
  }
}) as any);
app.post('/api/user/saved', (async function (req: Request, res: Response) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.replace('Bearer ', '');
  const { artwork_id } = req.body;
  if (!artwork_id) return res.status(400).json({ error: 'Missing artwork_id' });
  try {
    const payload = verifyJWT(token) as any;
    await prisma.saved.create({ data: { user_id: payload.sub, artwork_id } });
    res.json({ ok: true });
  } catch (e) {
    res.status(401).json({ error: 'Invalid token or already saved', details: e });
  }
}) as any);
app.delete('/api/user/saved', (async function (req: Request, res: Response) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.replace('Bearer ', '');
  const artwork_id = req.body.artwork_id || req.query.artwork_id;
  if (!artwork_id) return res.status(400).json({ error: 'Missing artwork_id' });
  try {
    const payload = verifyJWT(token) as any;
    await prisma.saved.delete({ where: { user_id_artwork_id: { user_id: payload.sub, artwork_id } } });
    res.json({ ok: true });
  } catch (e) {
    res.status(401).json({ error: 'Invalid token or not saved', details: e });
  }
}) as any);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
}); 