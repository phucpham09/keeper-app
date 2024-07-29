import express from "express"
import pg from "pg"
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from 'dotenv';

dotenv.config();
const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

db.connect();

const app = express();
const port = process.env.PORT;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Thêm middleware để xử lý CORS
app.use(bodyParser.json()); // Sử dụng middleware để parse JSON body

app.get("/", async (req, res) =>{
    try {
        const result = await db.query("SELECT * FROM note");
        res.json(result.rows);
    } catch (error) {
        console.log(error);
    }
})

app.post("/add", async(req, res) => {
    try {
        const {title, content} = req.body;
        const result = await db.query("INSERT INTO note (title, content) VALUES ($1, $2) RETURNING *", [title, content]);
        const newNote = result.rows[0];
        res.status(201).json(newNote);
    } catch (error) {
        console.log(error);
    }
})

app.delete("/delete/:id", async(req, res) =>{
    try {
        const id = parseInt(req.params.id);
        const result = await db.query("DELETE FROM note where id = ($1) RETURNING *", [id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.log(error);
    }
})


app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  })