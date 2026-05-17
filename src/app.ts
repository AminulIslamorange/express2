import express, { type Application, type Request, type Response } from "express"

//import config from "./config";
import { pool } from "./db";
import { userRoute } from "./modules/user/user.routes";
import { profileRoutes } from "./modules/profile/profile.route";
const app:Application = express()
//const port = config.port

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));




app.get('/', (req: Request, res: Response) => {
  // res.send('Server Running!')
  res.status(200).json({
    "message": "Express Server running"
  })
});

app.use('/api/users',userRoute);
app.use('/api/profile',profileRoutes)









export default app;
