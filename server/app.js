import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import router from './auth/authRoutes.js';
import cors from 'cors';
import { supabase } from "./auth/supabaseClient.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true,               
}));
app.use('/api/auth', router);

app.get('/api/reservations', async (req, res) => {
  const { lastname, start_date } = req.query;
  let query = supabase.from('reservations').select('*');

  if (lastname) {
    query = query.eq('lastname', lastname);
  }
  if (start_date) {
    query = query.gte('start_date', start_date);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/api/reservations/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', id);

  if (error || !data.length) {
    return res.status(404).json({ error: `Reservation with ID ${id} not found` });
  }
  res.json(data[0]);
});

app.post('/api/reservations', async (req, res) => {
  const { name, lastname, phone, mail, start_date, end_date, room, price, adults, children } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required!' });

  const { data, error } = await supabase
    .from('reservations')
    .insert({ name, lastname, phone, mail, start_date, end_date, room, price, adults, children })
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Update
app.put('/api/reservations/:id', async (req, res) => {
  const { id } = req.params;
  const { name, lastname, phone, mail, start_date, end_date, room, price, adults, children } = req.body;

  const { data, error } = await supabase
    .from('reservations')
    .update({ name, lastname, phone, mail, start_date, end_date, room, price, adults, children })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// Delete
app.delete('/api/reservations/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Reservation deleted successfully' });
});

app.use(express.static(path.join(__dirname, "static")));
app.listen(port, () => console.log(`Server listening on port ${port}`));
