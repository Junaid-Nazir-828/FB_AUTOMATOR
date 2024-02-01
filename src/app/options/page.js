"use client"
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import Facebook from "../assets/facebook.png";
import Instagram from "../assets/instagram.jpeg";
import Tick from "../assets/tick.svg";
import { useContext } from "react";
import { UserContext } from "@/context/Context";
import { useRouter } from "next/navigation";

export default function Logins() {
  const ctx=useContext(UserContext)
  const router=useRouter()
  

      useEffect(()=>{
        if(ctx.state.loggedIn==false){
          router.push('/')
            }
      },[ctx.state.loggedIn])
  return (
    <main className="flex items-center justify-center gap-12 h-screen bg-gray-100">
      <div className="relative bg-white py-6 px-6 mx-6 rounded-3xl w-80 h-[90] my-4 shadow-xl">
        <Image
          className="flex items-center absolute rounded-full shadow-xl left-8 -top-6"
          src={Facebook}
          alt="Facebook"
          width={80}
        />
        <div className="mt-14">
          <p className="text-xl font-semibold my-4">Facebook</p>
          <div className="border-t-2"></div>
          <div className="flex space-x-2 text-gray-400 text-lg my-3">
            <Image src={Tick} alt="Tick" width={15} height={15} />
            <p>Schedule Posts</p>
          </div>
          <div className="flex space-x-2 text-gray-400 text-lg my-3">
            <Image src={Tick} alt="Tick" width={15} height={15} />
            <p>Group Engagement</p>
          </div>
          <div className="flex space-x-2 text-gray-400 text-lg my-3">
            <Image src={Tick} alt="Tick" width={15} height={15} />
            <p>Private Messaging</p>
          </div>
          <Link href="/options/facebook" className="flex justify-center">
            <button className="text-white bg-[#1877F2] py-3 px-7 hover:bg-[#045ccf] rounded text-xl">
              Login with Facebook
            </button>
          </Link>
        </div>
      </div>
      <div className="mx-4 text-gray-600">
        <span className="text-2xl font-semibold">OR</span>
      </div>
      <div className="relative bg-white py-6 px-6 mx-6 rounded-3xl w-80 h-[90] my-4 shadow-xl">
        <Image
          className="flex items-center absolute rounded-full shadow-xl left-8 -top-6"
          src={Instagram}
          alt="Instagram"
          width={80}
        />
        <div className="mt-14">
          <p className="text-xl font-semibold my-2">Instagram</p>
          <div className="border-t-2"></div>
          <div className="flex space-x-2 text-gray-400 text-lg my-3">
            <Image src={Tick} alt="Tick" width={15} height={15} />
            <p>Strategic Comments</p>
          </div>
          <div className="flex space-x-2 text-gray-400 text-lg my-3">
            <Image src={Tick} alt="Tick" width={15} height={15} />
            <p>Direct Messaging</p>
          </div>
          <div className="flex space-x-2 text-gray-400 text-lg my-3">
            <Image src={Tick} alt="Tick" width={15} height={15} />
            <p>Hashtag Precision</p>
          </div>
          <Link href="/options/instagram" className="flex justify-center">
            <button className=" text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 py-3 px-7 rounded text-xl hover:opacity-80">
              Login with Instagram
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
