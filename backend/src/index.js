import { app } from "./app.js";
import dotenv from "dotenv"
import connectDB from "./db/connectDB.js";


dotenv.config({
    path: "./env"
})


const port = process.env.PORT || 5000

connectDB().then(() => {
    app.on('error', (error) => {
        console.log("error while run the express app");
    })

    app.listen(port, () => {
        console.log(`server is running on port ${port}`);
    })
}).catch((error) => {
    console.log(`error while connect the db ${error}`);
})