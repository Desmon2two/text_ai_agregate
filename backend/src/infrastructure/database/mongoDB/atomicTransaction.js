import mongoose from "mongoose";

async function execute(operation){
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const context = {session};
        const result = await operation(context);
        await session.commitTransaction();
        return result
        
    } catch (error) {
        await session.abortTransaction();
        throw error 
    } finally {
        await session.endSession()
    }
}

export default {execute}