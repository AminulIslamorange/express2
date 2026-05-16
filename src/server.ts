import express, { type Application, type Request, type Response } from "express"
import { Pool } from 'pg'
const app:Application = express()
const port = 5000

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  connectionString:"postgresql://neondb_owner:npg_o8heIdmRQ2rn@ep-snowy-frog-aqs3yu86-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
});

app.get('/', (req: Request, res: Response) => {
  // res.send('Server Running!')
  res.status(200).json({
    "message": "Express Server running"
  })
})

app.listen(port, () => {
  console.log(`server running on port ${port}`)
})
