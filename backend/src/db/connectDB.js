import mongoose from "mongoose"


const connectDB = async () => {
    try {
        const connectionString = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`)
        console.log("successfully connect to DB", connectionString.connection.host);
    } catch (error) {
        console.log("failed to connect to DB", error);
    }
}

export default connectDB