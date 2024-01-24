import Automata from "@/model/DataSchema";
import { NextResponse } from "next/server";

export async function GET(){
try {
    const userData=await Automata.find()
    if(userData){
        return NextResponse.json({
            message:"Got data successfully!",
            success:true,
            userData
        },{
            status:200
        })
    }
} catch (error) {
return NextResponse.json({
    message:"Couldnot get data",
    success:false
},{
    status:500
})
}
    

}