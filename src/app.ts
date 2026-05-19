import express, { type Application, type Request, type Response } from "express"

//import config from "./config";
import { pool } from "./db";
import { userRoute } from "./modules/user/user.routes";
import { profileRoutes } from "./modules/profile/profile.route";
import { authRouter } from "./modules/auth/auth.route";
import logger from "./midleware/looger";
const app:Application = express();

import CookieParser from 'cookie-parser';
import cors from 'cors'
import { globalErrorHanlder } from "./midleware/globalErrorHandlar";

//const port = config.port
app.use(CookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
const corsOptions = {
  origin: 'http://localhost:5000',
 
}

app.use(cors(corsOptions));




app.get('/', (req: Request, res: Response) => {
  // res.send('Server Running!')
  res.status(200).json({
    "message": "Express Server running"
  })
});

app.use('/api/users',userRoute);
app.use('/api/profile',profileRoutes)
app.use('/api/auth',authRouter)





// Global Error Handling Middleware
app.use(globalErrorHanlder);


export default app;
