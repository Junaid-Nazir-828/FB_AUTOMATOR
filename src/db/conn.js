import mongoose from "mongoose";

export async function conn(){
    try{
        const db = await mongoose.connect(process.env.MONGO_URL)
        if(db){
            console.log("MongoDB Connected Successfully")
        }else{
            throw new Error("couldn't connect to Db")
        }
    } catch(error){
        console.log(error)
    }
    

    
}
