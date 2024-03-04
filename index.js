import { dbConnection } from "./db.js";
import  express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { userRouter } from "./Routes/users.js";
import { notesRouter } from "./Routes/notes.js";
import { isAuthenticted } from "./Controller/auth.js";
import { taskUserRouter } from "./Routes/taskUser.js";
import { taskUrlRouter } from "./Routes/taskUrl.js";


//config the env
dotenv.config()
const PORT = process.env.PORT

const app = express();


//middleware
app.use(express.json());
app.use(cors());

//db connection 
dbConnection()

//routes
app.use("/api/user",userRouter)
app.use("/api/notes",isAuthenticted, notesRouter)
app.use("/url", taskUserRouter)
app.use("/url", taskUrlRouter)


//server listner
app.listen(PORT, ()=>console.log("server runnig in localhost", `${PORT}`))
