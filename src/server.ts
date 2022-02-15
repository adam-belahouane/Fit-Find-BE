import express, { NextFunction } from "express";
import cors from "cors";
import usersRouter from "./routes/users";
import proUsersRouter from "./routes/proUser";
import postsRouter from "./routes/posts/posts";
import cookieParser from "cookie-parser"
import listEndpoints from "express-list-endpoints"
import reviewsRouter from "./routes/reviews";
import programsRouter from "./routes/programs/programs";



const server = express();

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL, "http://localhost:3000"]

console.log('whitelist:', whitelist)

const corsOptions = {
  origin: function (origin: any, next: any) {

    if (whitelist.indexOf(origin) !== -1) {
      next(null, next)
    } else {
      console.log("error")
    }
  },
  credentials: true
}



server.use(cors(corsOptions));
server.use(cookieParser())
server.use(express.json());




// Routes

server.use("/users" , usersRouter)
server.use("/proUser" , proUsersRouter)
server.use("/posts" , postsRouter)
server.use("/reviews", reviewsRouter)
server.use("/program", programsRouter)

console.table(listEndpoints(server))

export { server }