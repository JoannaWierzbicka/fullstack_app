import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

app.get('/api/reservations', async (req, res) => {
    const {lastname, start_date} = req.query
    let query = supabase.from('reservations').select('*')
    
    if(lastname !== undefined){
        query = query.eq('lastname', lastname)
    }

    if (start_date !== undefined) {
        query = query.gte('start_date', start_date); // or .eq / .gte means greater than of equal
    }
    
    const {data, error} = await query

    if(error){
        return res.status(500).json({error: error.message})
    }

    res.json(data);
})

app.get('/api/reservations/:lastname', async (req, res) => {
    const {lastname} = req.params
    const {data, error} = await supabase
        .from('reservations')   
        .select('*')
        .eq('lastname', lastname)

    if(error){
        return res.status(404).json({error: `Reservation for ${lastname} not found`})
        }
    
    res.json(data)
})

app.post('/api/reservations', async (req, res) => {
    const {name, lastname, phone, mail, start_date, end_date, room, price} = req.body

    if(!name){
        return res.status(400).json({error: 'Name is required!'})
    }

    const {data, error} = await supabase
        .from('reservations')
        .insert({name, lastname, phone, mail, start_date, end_date, room, price})
        .select()

    res.status(201).json(data[0])
})

app.put('/api/reservations/:id', async (req, res) => {
    const {id} = req.params
    const {name, lastname, phone, mail, start_date, end_date, room, price} = req.body   

    const {data, error} = await supabase
        .from('reservations')
        .update({name, lastname, phone, mail, start_date, end_date, room, price})
        .eq('id', id)
        .select()

    if(error){
        return res.status(500).json({error: error.message})
    } 

    res.json(data[0])
})

app.delete('/api/reservations/:id', async (req, res) => {
    const {id} = req.params
    const {data, error} = await supabase   
        .from('reservations')
        .delete()
        .eq('id', id)

    if(error){
        return res.status(500).json({error: error.message})
    } 

    res.json({message: 'Reservation deleted succesfully'})
})


app.use(express.static(path.join(__dirname, "static")));

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });