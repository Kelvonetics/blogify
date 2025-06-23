import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        const connect = await mongoose.connect(process.env.DB_URI);
        console.log("Established Database Connection !");
    } catch (error) {
        console.log(`Error occurred while connecting to database ${error}`);
        process.exit(1);
    }
}

export default connectDB