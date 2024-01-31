import axios from "axios"
import { NextResponse } from "next/server"

export async function POST(req){
    const {url,data}=await req.json()
   

    try {
        const response=await axios.post(url,data)
       
        if(!response){
            throw new Error("Server error")
        }

        return NextResponse.json({message:"Data Recieved by server.",data:response.data})
    } catch (error) {
        return NextResponse.json({message:"Error recieving data from server"},{status:500})
    }

  
}