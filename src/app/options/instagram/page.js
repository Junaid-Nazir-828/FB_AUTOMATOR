"use client";

import React, { useContext, useState } from "react";
import Image from "next/image";
import Logo from "../../assets/instagram.jpeg";
import axios from "axios";
import { Tabs,Tab,TabsHeader } from "@material-tailwind/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {v4 as uuidv4} from 'uuid'
import { UserContext } from "@/context/Context";
import { useRouter } from "next/navigation";
export default function Instagram() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [limit, setLimit] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [comment, setComment] = useState("");
  const [privateMessage, setPrivateMessage] = useState("");
  const [commentChecked, setCommentChecked] = useState(false);
  const [privateMessageChecked, setPrivateMessageChecked] = useState(false);
  const [activeTab, setActiveTab] = useState("post");
  const [serverResponse, setServerResponse] = useState(null);
  const[loading,setLoading]=useState("")
  const[status,setStatus]=useState("In process")
  const pathname = usePathname();
  const {dispatch}=useContext(UserContext)
  const ctx=useContext(UserContext)
  const router=useRouter()

 
  useEffect(()=>{
    if(ctx.state.loggedIn==false){
      router.push('/')
    }
  },[ctx.state.loggedIn,router])
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handleHashtagChange = (event) => {
    let newValue = event.target.value;

    // Allow only numbers and alphabets
    const alphanumericRegex = /^[a-zA-Z0-9]*$/;
    if (!alphanumericRegex.test(newValue)) {
      // Remove any non-alphanumeric characters
      newValue = newValue.replace(/[^a-zA-Z0-9]/g, "");
    }

    // Add a hashtag if the user doesn't provide one
    if (!newValue.startsWith("#")) {
      newValue = "#" + newValue;
    }

    setHashtag(newValue);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handlePrivateMessageChange = (event) => {
    setPrivateMessage(event.target.value);
  };

  const handleCommentCheckboxChange = () => {
    setCommentChecked(!commentChecked);
  };

  const handlePrivateMessageCheckboxChange = () => {
    setPrivateMessageChecked(!privateMessageChecked);
  };

  // ================================================================
  const updateData = async () => {
    // console.log(serverResponse)    
    const updatedResponse = await axios.put(
      "https://clownfish-app-utnsf.ondigitalocean.app/api/updatedata",
      serverResponse
    );
    if(updatedResponse.status==200){
      dispatch({type:"set-user",payload:updatedResponse.data.userData})
          }

    // console.log(updatedResponse, ".........................");
   
  };
  // =================================================================



  //=====================================================
  
  //REMOVE SET INTERVAL , JUST CALL UPDATE FUNCTION INSIDE USE EFFECT, IT WAS USED TO MIMIC WAITING FOR SERVER RESPONSE TO TRIGGER THE UPDATE FUNCTION
  // useEffect(() => {
  //   if(serverResponse!= null){
  //        const interval = setInterval(() => {
  //       // console.log("after 5 sec")
  //    updateData()
  //    clearInterval(interval)
  //   }, 2000);
  //   }
  // }, [serverResponse]);

  //=====================================================

  const isCommentDisabled = !commentChecked;
  const isPrivateMessageDisabled = !privateMessageChecked;

  // ===============================================
  const isButtonDisabled =
    !(commentChecked || privateMessageChecked) ||
    !username ||
    !password ||
    !limit ||
    !hashtag ||
    (commentChecked && !comment) ||
    (privateMessageChecked && !privateMessage);
// =================================================


  const handleSubmit = async () => {
    if (isButtonDisabled) {
      return;
    }
    setLoading("Saving your post...")
    const campaignId=uuidv4();
    const data = {
      username,
      password,
      userId:ctx.state.userData?._id,
      limit,
      hashtag,
      campaignId,
      comment: commentChecked ? comment : "",
      privateMessage: privateMessageChecked ? privateMessage : "",
    };
    
const dataToSend={
      username,
      password,
     userId:ctx.state.userData?._id,
     campaignId,
      limit,
      hashtag,
      comment: commentChecked ? comment : "",
      privateMessage: privateMessageChecked ? privateMessage : "",
      activeTabLabel,
      pathname:"instagram",
      status

}

try {
    const dataResponse=await axios.post("https://clownfish-app-utnsf.ondigitalocean.app/api/addinsta",dataToSend)
    if(dataResponse.status==201){
      setLoading("Saved!")
      dispatch({type:"set-user",payload:dataResponse.data.userData})
     
    }
    // console.log(dataResponse,"..........response insta")
    
    
} catch (error) {
    console.log(error)
}


// sending data to server to avoid CORS error, because api folder contains api routes and they are server components so sending request from server to remote server of INSTAGRAM. client request to server on another ip cause CORS error
const serverUrlData={

url:`http://164.92.93.53/instagram`,
data:data,

}
    try {
      const response = await axios.post(
        "https://clownfish-app-utnsf.ondigitalocean.app/api/reqtoserver",
        serverUrlData,
      );

      //IF SERVER RESPONDS WITH STATUS 200 OK WITH DATA {USERID, CAMPAIGNID, STATUS:COMPLETED} THEN WE ARE SETTING
      //SERVER RESPONSE TO THAT INFO AND IF THE SERVER DATA IS SET, USEEFECT WILL DETECT THAT SERVER DATA HAS BEEN SET IT WILL TRIGGER THE UPDATE FUNCTION, AFTER UPDATION U MAY NEED TO LOGIN AGAIN BECAUSE STATE UPDATION RELOADS THE COMPONENT/REFRESH THE PAGE.
 if(response){
  // setServerResponse( 
  //   {
  //       userId: ctx.state.userData?._id,   //response.userId
  //       campaignId: "79c50a41-b4ff-49a9-a68d-b058773ac99a",   //response.campaignId
  //       status: "completed"     //response.status
  //     })
 }
    // console.log(" res fromm server")

  
      console.log("Data: ", response.data);
    } catch (error) {
      console.error("Error: ", error.message);
    }

    setUsername("");
    setPassword("");
    setLimit("");
    setHashtag("");
    setComment("");
    setPrivateMessage("");
    setCommentChecked(false);
    setPrivateMessageChecked(false);
  };

  const data = [
    {
      label: "Post",
      value: "post",
    },
    {
      label: "Campaign Results",
      value: "campaign-results",
    },
   
  ];
  const activeTabData = data.find((tab) => tab.value === activeTab);
  const activeTabLabel = activeTabData ? activeTabData.label : "";
  return (
    <main className="flex flex-col items-center bg-gradient-to-b from-red-600 via-purple-600 to-white ">
      
      <Image
        className="rounded-full shadow-xl mt-10 mb-4"
        src={Logo}
        alt="Facebook"
        width={70}
      />
      <Tabs value={activeTab}>
      
      <TabsHeader
          className="rounded-none border-blue-gray-50 bg-transparent p-0"
          indicatorProps={{
            className:
              "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
          }}
        >
          {data.map(({ label, value }) => (
            <div className="flex" key={label}>
              <Tab
                key={value}
                value={value}
                onClick={() => setActiveTab(value)}
                className={
                  activeTab === value
                    ? "text-black font-medium rounded-lg m-2 p-2 cursor-pointer hover:bg-gray-200 hover:transition hover:duration-300 hover:ease-in-out"
                    : "text-white rounded-lg m-2 p-2 cursor-pointer hover:bg-gray-200 hover:transition hover:duration-300 hover:ease-in-out"
                }
              >
                <p className="">{label}</p>
              </Tab>
            </div>
          ))}
        </TabsHeader>
        {
            activeTab=="post" ? <>
            <div className="w-[97%]  mx-2 md:w-full bg-slate-200 px-5 py-2 mb-3 rounded-lg">
        <label
          htmlFor="username"
          className="block mb-1 mt-2 text-base font-medium text-gray-900"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg w-full mb-3 p-2"
          required={!isButtonDisabled}
        />
        <label
          htmlFor="password"
          className="block mb-1 text-base font-medium text-gray-900 relative"
        >
          Password
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={handlePasswordChange}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg w-full mb-3 p-2"
            required={!isButtonDisabled}
          />
          <div
            onClick={handleTogglePassword}
            className="absolute right-2 top-[43px] transform -translate-y-1/2 cursor-pointer"
          >
            {showPassword ? (
              <svg
                onClick={handleTogglePassword}
                className="relative"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0"
                />
              </svg>
            ) : (
              <svg
                onClick={handleTogglePassword}
                className="relative"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M2 5.27L3.28 4L20 20.72L18.73 22l-3.08-3.08c-1.15.38-2.37.58-3.65.58c-5 0-9.27-3.11-11-7.5c.69-1.76 1.79-3.31 3.19-4.54zM12 9a3 3 0 0 1 3 3a3 3 0 0 1-.17 1L11 9.17A3 3 0 0 1 12 9m0-4.5c5 0 9.27 3.11 11 7.5a11.79 11.79 0 0 1-4 5.19l-1.42-1.43A9.862 9.862 0 0 0 20.82 12A9.821 9.821 0 0 0 12 6.5c-1.09 0-2.16.18-3.16.5L7.3 5.47c1.44-.62 3.03-.97 4.7-.97M3.18 12A9.821 9.821 0 0 0 12 17.5c.69 0 1.37-.07 2-.21L11.72 15A3.064 3.064 0 0 1 9 12.28L5.6 8.87c-.99.85-1.82 1.91-2.42 3.13"
                />
              </svg>
            )}
          </div>
        </label>
        <label
          htmlFor="limit"
          className="block mb-1 text-base font-medium text-gray-900"
        >
          Limit
        </label>
        <input
          id="limit"
          type="number"
          value={limit}
          onChange={handleLimitChange}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg w-full mb-3 p-2"
          required={!isButtonDisabled}
        />
        <label
          htmlFor="hashtag"
          className="block mb-1 text-base font-medium text-gray-900"
        >
          Hashtags
        </label>
        <input
          id="hashtag"
          value={hashtag}
          onChange={handleHashtagChange}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg w-full mb-3 p-2"
          required={!isButtonDisabled}
        />
        <label
          htmlFor="comment"
          className="block mb-1 text-base font-medium text-gray-900"
        >
          Comment
        </label>
        <input
          id="comment"
          value={comment}
          onChange={handleCommentChange}
          className={`shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg w-full mb-3 p-2 ${
            isCommentDisabled ? "opacity-60 cursor-not-allowed" : ""
          }`}
          required={commentChecked}
          disabled={isCommentDisabled}
        />
        <label
          htmlFor="private-message"
          className="block mb-1 text-base font-medium text-gray-900"
        >
          Private Message
        </label>
        <input
          id="private-message"
          value={privateMessage}
          onChange={handlePrivateMessageChange}
          className={`shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg w-full mb-3 p-2 ${
            isPrivateMessageDisabled ? "opacity-60 cursor-not-allowed" : ""
          }`}
          required={privateMessageChecked}
          disabled={isPrivateMessageDisabled}
        />
        <div className="flex justify-center items-center">
          <label htmlFor="comment-checkbox" className="text-gray-900 text-base">
            Comment
          </label>
          <input
            type="checkbox"
            id="comment-checkbox"
            className="m-2 w-4 h-4"
            checked={commentChecked}
            onChange={handleCommentCheckboxChange}
          />
          <label
            htmlFor="private-message-checkbox"
            className="text-gray-900 text-base"
          >
            Private Message
          </label>
          <input
            type="checkbox"
            id="private-message-checkbox"
            className="m-2 w-4 h-4"
            checked={privateMessageChecked}
            onChange={handlePrivateMessageCheckboxChange}
          />
        </div>
        
        <p>{loading? loading:""} &nbsp;&nbsp; {loading?<button onClick={()=>{
              setLoading("")
            }} className="bg-red-400 p-1 rounded-md hover:shadow-lg">❌</button>:""} </p>

        <div className="flex justify-center">
          <button
            type="submit"
            className={`text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold px-5 py-2 my-2 text-center ${
              isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleSubmit}
          >
            Start
          </button>
        </div>
      </div></> : <div className="w-[97%]  mx-2 md:w-full h-[30rem] bg-slate-100 px-5 py-2 mb-3 rounded-lg overflow-y-auto " >

        {ctx.state.userData?.instagramData?.length>0? 
        <>
        {ctx.state.userData?.instagramData?.map((inst,index)=>{
            return <div key={index} className="bg-orange-200 p-2 my-4 rounded-md shadow-lg">
            <p className="text-2xl font-bold inline-block text-red-700">{index+1}. &nbsp;</p>
                <h3 className="font-bold inline-block capitalize text-2xl">{inst.pathname}/ <span className="font-normal ">{inst.category}</span></h3>
                <p className="font-bold my-2">Status: <span className="font-normal">{inst.status}</span></p>
                <p className="font-bold mt-2">Limit: <span className="font-normal bg-white px-5 py-2 rounded-md">{inst.limit}</span></p>
                <p className="font-bold mt-2">Hashtag: </p>
                <p className="bg-white p-2 rounded-md">{inst.hashtag}</p>
                <p className="font-bold mt-2">Campaign ID: </p>
                <p className="bg-white p-2 rounded-md">{inst.campaignId}</p>
                <p className="font-bold mt-2">{inst.comment? "Comment:":"Private Message:"}</p>

                <p className="break-words w-80 md:w-96 bg-white mb-2 p-2 rounded-md">{inst.comment? inst.comment:inst.privateMessage}</p>
                <p className="font-bold mt-2">{inst.privateMessage && inst.comment ? "Private Message:":""}</p>
                {inst.privateMessage && inst.comment ? <p className="break-words bg-white w-80 md:w-96 mb-2 p-2 rounded-md"> {inst.privateMessage}</p>:""}
              
            </div>
        })
        }
        </>
        :"No Data to show! Try Logging in again."}
      </div>
        }
      </Tabs>
      
    </main>
  );
}
