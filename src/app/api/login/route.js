
import { NextResponse } from "next/server"
import Automata from "@/model/DataSchema";
import { conn } from "@/db/conn"
conn();
export async function POST(req){
const {email,password}=await req.json()


try{
    
    const userExist=await Automata.findOne({email:email})
    if(!userExist){
      throw new Error("user not exists!")
    }
    if(userExist){
        const matchedPass= password==userExist.password;
        if(!matchedPass){
            throw new Error("invalid credentials")
        }
        else{
           const response= NextResponse.json({
            message:"logged in successfully!",
            success:true,
            userExist:{
                _id:userExist._id,
                facebookData:userExist.facebookData,
                instagramData:userExist.instagramData
            }
        },{
            status:200
        })

         NextResponse.redirect(new URL('/options',req.url));
        return response;
        }
     
    } 
   
}
catch(err){
    console.log(err)
return NextResponse.json({
    message:"couldn't logged in",success:false
},{
    status:500
})
}
}