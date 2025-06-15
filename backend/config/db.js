import mongoose from "mongoose";

//function to connect database with backend
const connectDB = async () => {

    try {
        //event listener
        mongoose.connection.on('connected', () => {
            console.log("Database Connected.")
        })

        mongoose.connection.on('error', (err) => {
            console.log("DB connection error:", err);
        });
        
        await mongoose.connect(process.env.MONGODB_URL)

    } catch (error) {
        console.log("Database Connection Failed", error);
    }

}

export default connectDB;

