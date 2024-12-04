import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
    console.log('testttttt');
    //asddfdasf
    if(!process.env.JWT_KEY) throw new Error("JWT must be defined");
    if(!process.env.MONGO_URI) throw new Error("JWT must be defined");
    console.log('testt');

    try {
        mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to mongodb');
        
    } catch (error) {
        console.log(error);
    }
    app.listen(3000, () => {
        console.log("Auth service is running http://localhost:3000!")
    });
}
start();
