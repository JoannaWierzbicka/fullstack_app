import express from 'express';
import { supabase } from './supabaseClient.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Supabase registration error:', error);
    const msg = error.message?.toLowerCase();
    if (msg.includes('already') || msg.includes('registered')) {
      return res.status(400).json({ error: { message: 'User already registered' }, user: null });

    }

    return res.status(400).json({ error: error.message, user: null });
  }

  return res.status(200).json({ user: data.user, error: null });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('Login error:', error);
    return res.status(400).json({ error: error.message });
  }

  return res.json({ session: data.session, user: data.user });
});

router.post('/logout', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const { error } = await supabase.auth.signOut({ access_token: token });

  if (error) {
    console.error('Logout error:', error);
    return res.status(400).json({ error: error.message });
  }

  return res.json({ message: 'Logged out' });
});

export default router;
