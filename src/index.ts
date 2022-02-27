import { server } from './server'
import mongoose from "mongoose"
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3001;


mongoose.connect(process.env.MONGO_URL!)
    .then(() => {
        console.log(`Connected to Mongo`);
        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        })
    }).catch((error) => console.log(error))