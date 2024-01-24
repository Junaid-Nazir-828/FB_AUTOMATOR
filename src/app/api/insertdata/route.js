
import Automata from "@/model/DataSchema";
import { conn } from "@/db/conn";
import { NextResponse } from "next/server";
conn()
export async function POST(req) {
    const {
      groupId,
      userId,
      status,
      activeTabLabel,
      campaignId,
      pathname,
      publishText,
      comment,
    
      limit,
      privateMessage,
      
      
    } = await req.json();
  console.log(userId,groupId,publishText,"c:",comment,privateMessage)
    let newData;
  
    if (activeTabLabel === "Publish") {
      newData = {
        groupId,
        publishText,
        category: activeTabLabel,
        pathname,
        campaignId,
        status
      };
    } else if (activeTabLabel === "Comment" ) {
      newData = {
        groupId,
        comment,
        category: activeTabLabel,
        pathname,
        campaignId,
        limit,
        status
      };
    } else if (activeTabLabel === "Private Messages") {
      newData = {
        groupId,
        privateMessage,
        category: activeTabLabel,
        pathname,
        campaignId,
        limit,
        status
      };
    }
  try {
    if (pathname === "facebook" && newData) {
        const userExist = await Automata.findOne({ _id: userId });
    
        if (userExist) {
          userExist.facebookData.push(newData);
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