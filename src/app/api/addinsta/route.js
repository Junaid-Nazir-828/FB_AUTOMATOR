
import Automata from "@/model/DataSchema";
import { conn } from "@/db/conn";
import { NextResponse } from "next/server";
conn()
export async function POST(req) {
    const {
      userId,
      status,
      hashtag,
      activeTabLabel,
      campaignId,
      pathname,
      comment,
      limit,
      privateMessage,
      
      
    } = await req.json();
  console.log(userId,"c:",comment,privateMessage)
    let newData;
     if (privateMessage && comment) {
      newData = {
        privateMessage,
        comment,
        category: activeTabLabel,
        pathname,
        campaignId,
        limit,
        status,
        hashtag
      };}
   else if (comment) {
      newData = {
        comment,
        category: activeTabLabel,
        pathname,
        campaignId,
        status,
        hashtag,
        limit
      };
    } else if (privateMessage) {
      newData = {
        privateMessage,
        category: activeTabLabel,
        pathname,
        campaignId,
        limit,
        status,
        hashtag
      };
    } 

       
    
  try {
    if (pathname === "instagram" && newData) {
        const userExist = await Automata.findOne({ _id: userId });
    
        if (userExist) {
          userExist.instagramData.push(newData);
          await userExist.save();
          return NextResponse.json({
            message:"Added successfully",
            success:true,
            userData:userExist
          },{status:201})
        } else {
          throw new Error("User not found");
        }
      }
  } catch (error) {
    return NextResponse.json({
        message:"Couldn't add data",
        success:false,

    },{status:500})
  }
   
}