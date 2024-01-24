import Automata from "@/model/DataSchema";
import { conn } from "@/db/conn";
import { NextResponse } from "next/server";

conn();

export async function PUT(req) {
  const {
    userId,
    campaignId,
    status,
  } = await req.json();

  try {
    if (!userId || !campaignId || !status) {
      throw new Error("Missing required parameters");
    }

    const filter = { _id: userId };
    const update = {
      $set: {
        "facebookData.$[fbElem].status": status,
        "instagramData.$[instaElem].status": status,
      },
    };
    const options = {
      new: true,
      arrayFilters: [
        { "fbElem.campaignId": campaignId },
        { "instaElem.campaignId": campaignId },
      ],
    };

  
    const updateResult = await Automata.updateMany(filter, update, options);

    if (updateResult.modifiedCount === 0) {
      throw new Error("User or campaign not found");
    }

    const updatedUser = await Automata.findOne({ _id: userId });

    return NextResponse.json({
      message: "Campaign status updated successfully",
      success: true,
      userData: updatedUser,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      message: error.message || "An error occurred while updating campaign status",
      success: false,
    }, { status: 500 });
  }
}
