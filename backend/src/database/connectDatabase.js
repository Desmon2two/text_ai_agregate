import mongoose from "mongoose"
async function connectDatabase(){
    await mongoose.connect(process.env.MONGOURI);
    console.log("Database connected")
};
export default connectDatabase ;