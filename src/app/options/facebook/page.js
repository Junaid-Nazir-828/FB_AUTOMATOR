"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsHeader, Tab } from "@material-tailwind/react";
import Image from "next/image";
import Logo from "../../assets/facebook.png";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@/context/Context";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
export default function Facebook() {
  const ctx = useContext(UserContext);
  const { dispatch } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [groupId, setGroupId] = useState([]);
  const [publishText, setPublish] = useState("");
  const [comment, setComment] = useState("");
  const [privateMessage, setPrivateMessage] = useState("");
  const [limit, setLimit] = useState("");
  const [activeTab, setActiveTab] = useState("publish");
  const [status, setStatus] = useState("In process");
  const [file, setFile] = useState("");
  const[imageUrl,setImageUrl]=useState("");
  const [serverResponse, setServerResponse] = useState(null);
  const router=useRouter()
  const pathname = usePathname();
  const [loading,setLoading]=useState("")
 
  useEffect(()=>{
    if(ctx.state.loggedIn==false){
      router.push('/')
    }
  },[ctx.state.loggedIn,router])

  const data = [
    {
      label: "Publish",
      value: "publish",
    },
    {
      label: "Comment",
      value: "comment",
    },
    {
      label: "Private Messages",
      value: "private-messages",
    },
    {
      label: "Campaign Results",
      value: "campaign-results",
    },
  ];

  const activeTabData = data.find((tab) => tab.value === activeTab);
  const activeTabLabel = activeTabData ? activeTabData.label : "";

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleGroupIdChange = (event) => {
    const numericRegex = /^[\d,]*$/;
    const newValue = event.target.value;
    if (numericRegex.test(newValue)) {
      const newGroupId = newValue.split(",").map((num) => Number(num.trim()));
      setGroupId(newGroupId);
    }
  };

  const handleChoiceChange = (event) => {
    const { value } = event.target;
    switch (activeTabLabel) {
      case "Publish":
        setPublish(value);
        break;
      case "Comment":
        setComment(value);
        break;
      case "Private Messages":
        setPrivateMessage(value);
        break;
      default:
        break;
    }
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const isButtonDisabled = () => {
    switch (activeTabLabel) {
      case "Publish":
        return !(username && password && groupId.length > 0 && publishText);
      case "Comment":
        return !(
          username &&
          password &&
          groupId.length > 0 &&
          comment &&
          limit
        );
      case "Private Messages":
        return !(
          username &&
          password &&
          groupId.length > 0 &&
          privateMessage &&
          limit
        );
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (isButtonDisabled()) {
      return;
    }
    setLoading("Saving your post...")
    const campaignId = uuidv4();
    let dataToSend = {
      username,
      password,
      groupId,
      campaignId,
      userId: ctx.state.userData?._id,
      [activeTabLabel.toLowerCase()]:
        activeTabLabel === "Publish"
          ? publishText
          : activeTabLabel === "Comment"
          ? comment
          : privateMessage,
    };

    if (activeTabLabel === "Comment") {
      dataToSend = {
        ...dataToSend,
        limit,
        file,
        campaignId,
      };
    }
    if (activeTabLabel === "Private Messages") {
      dataToSend = {
        ...dataToSend,
        limit,
        campaignId,
      };
    }

    try {
      let dataToSend = {
        groupId,
        userId: ctx.state.userData._id,
        status: status,
        activeTabLabel,
        campaignId,
        pathname: pathname.split("/")[2],
        publishText,
      };
      if (activeTabLabel == "Comment") {
        dataToSend = {
          groupId,
          userId: ctx.state.userData._id,
          status: status,
          activeTabLabel,
          campaignId,
          comment,
          pathname: pathname.split("/")[2],
          imageUrl,
          limit,
        };
      } else if (activeTabLabel == "Private Messages") {
        dataToSend = {
          groupId,
          userId: ctx.state.userData._id,
          status: status,
          activeTabLabel,
          campaignId,
          privateMessage,
          pathname: pathname.split("/")[2],
          limit,
        };
      }
      const dataResponse = await axios.post(
        "https://clownfish-app-utnsf.ondigitalocean.app/api/insertdata",
        dataToSend
      );
      // console.log(dataResponse, ".............");
      if (dataResponse.status == 201) {
        setLoading("Saved!")
        dispatch({ type: "set-user", payload: dataResponse.data.userData });
       
      }
    } catch (error) {
      console.log("Error Storing", error);
    }

    setUsername("");
    setPassword("");
    setGroupId([]);
    setPublish("");
    setComment("");
    setPrivateMessage("");
    setLimit("");
 
    const serverUrlData={

      url:"http://164.92.93.53/facebook",
      data:{
        username,
        password,
        groupId,
        userId: ctx.state.userData._id,
        status: status,
        activeTabLabel,
        campaignId,
        comment,
        pathname: pathname.split("/")[2],
        imageUrl,
        limit,
      },
      
      }

      try {
        const response =  await axios.post(
          "https://clownfish-app-utnsf.ondigitalocean.app/api/reqtoserver", serverUrlData,
          {headers:{
            "Content-Type": "application/json",
          }}
        );
        
// REMOVE THIS WHOLE CODE ==== BELOW IF WE DONT WANT TO UPDATE STATUS BASED ON RESPONSE BACK

        // =====================================================================================
        //ASSUMING IF SERVER SEND SUCCESSFUL RESPONSE BASED ON THAT WE SET THE SERVER RESPONSE, USERID
      //WILL BE SAME AND WILLBE SAVED AFTER LOGIN,  CAMPAIGNID AND STATUS IS DYNAMIC AND SENT BY SERVER. SET 
      //THOSE VALUES BASED ON SERVER RESPONSE,  WHEN THE RESPONSE IS SET USEEFFECT WILL BE CALLED AFTER DETECTING REPONSE HAS BEEN SET AND WILL TRIGGER THE UPDATE DATA FUNCTION WITH SERVER RESPONSE.  IF CLIENT SENDS ANOTHER REQUEST BEFORE GETTING RESPONSE BACK FOR PREVIOUS ONE, NOW CLIENT IS WAITING FOR UPDATING STATUS
      //FOR LATEST ADDED CAMPAIGN ONLY NOT FOR PREVIOUS ONE
    if(response){
      setLoading("Uploaded!")
      // console.log(" res fromm server")
      // setServerResponse( 
      //           {
      //               userId: ctx.state.userData?._id,          //response.userId,  
      //               campaignId: "bf7b9873-fdbf-4d25-989e-a1f16db9df08",   // response.campaignId
      //               status: "completed"         // response.status
      //             })
    }
    // ====================================================================================
        console.log("Data: ", response.data);
      } 
      
    catch (error) {
      console.error("Error:", error.message);
    }
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }

    

  };
  const updateData = async () => {
    console.log(serverResponse)
    const updatedResponse = await axios.put(
      "https://clownfish-app-utnsf.ondigitalocean.app/api/updatedata",
      serverResponse
    );
    if(updatedResponse.status==200){
dispatch({type:"set-user",payload:updatedResponse.data.userData})
    }

    // console.log(updatedResponse, ".........................");
 
  };

// ===============================================================
  
  // useEffect(() => {
  //   if(serverResponse!= null){
  //     //remove this interval only 
  //       // console.log("after 5 sec")
  //    updateData()
  
   
  //   }
  // }, [serverResponse]);

  // =================================================================
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-white transition ">
      <Image
        className="rounded-full shadow-xl mb-4  mt-6"
        src={Logo}
        alt="Facebook"
        width={90}
      />
      <Tabs value={activeTab} className="">
        <TabsHeader
          className=" flex flex-wrap border-blue-gray-50 w-[95%] md:w-full mx-auto bg-blue-600 rounded-lg p-0"
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
                    ? "text-black font-medium rounded-lg m-2 p-2 cursor-pointer hover:bg-gray-200  hover:transition hover:duration-300 hover:ease-in-out"
                    : "text-blue-100 rounded-lg m-2 p-2 cursor-pointer hover:bg-blue-800 hover:transition hover:duration-300 hover:ease-in-out"
                }
              >
                <p className="w-full">{label}</p>
              </Tab>
            </div>
          ))}
        </TabsHeader>

        {activeTab === "campaign-results" ? (
          <div className="h-96 w-full mt-5 overflow-y-auto rounded-lg p-4 shadow- bg-blue-200">
            {ctx.state.userData?.facebookData?.length > 0
              ? ctx.state.userData?.facebookData?.map((fb,index) => {
                  return (
                    <div key={fb.campaignId} className="bg-blue-300 p-3 rounded-md my-4 shadow-lg  w-full">
                      <p className="font-bold">
                     <p className="text-3xl inline-block text-blue-700">{index+1}</p>.  &nbsp; <span className="text-2xl capitalize">{fb.pathname}/</span> 
                        <span className="font-normal">{fb.category}</span>
                      </p>

                      <p className="font-bold mt-3">
                        Status: &nbsp; 
                        {fb.status == "completed" ||
                        fb.status == "Completed" ? (
                          <span className="text-green-700 bg-slate-100 px-3 py-2 rounded-md font-normal">  {fb.status}</span>
                        ) : (
                          <span className="text-yellow-700 font-normal bg-slate-100 px-3 py-2 rounded-md">  {fb.status}</span>
                        )}
                      </p>
                      <p className="font-bold mt-2">Campaign Id: </p>
                      <p className="bg-slate-100 w-full rounded-md p-2 mb-2 mx-0">{fb.campaignId}</p>
                      <p className="font-bold mt-2"> Group ID: </p>
                      <p className="bg-slate-100 w-full rounded-md p-2 mb-2 mx-0">{fb.groupId.join(",")}</p>
                      <p className="font-bold mt-2">Publish/Comment/Private Message:</p>
                      <p className="break-words w-[20rem] md:w-[27rem] bg-slate-100  rounded-md p-2 mb-2 mx-0 ">
                      
                       {fb.publishText
                          ? fb.publishText
                          : fb.comment
                          ? fb.comment
                          : fb.privateMessage}
                        
                      </p>
                     

                      
                   
                      {fb.limit ? <p className="font-bold">Limit: <span className="font-normal">{fb.limit}</span> </p> : ""}
                     
                    </div>
                  );
                })
              : "No data to show! Try Logging In again."}
          </div>
        ) : (
          <div className="bg-blue-200 w-full rounded-lg my-5 shadow-lg p-3">
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
              required
            />
            <label
              htmlFor="password"
              className="block  mb-1 text-base font-medium text-gray-900 relative"
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
              htmlFor="groupId"
              className="block mb-1 text-base font-medium text-gray-900"
            >
              Group ID <small>(comma separated)</small>
            </label>
            <input
              type="text"
              id="groupId"
              value={groupId}
              onChange={handleGroupIdChange}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg w-full mb-3 p-2"
              required
            />

            <label
              htmlFor="choice"
              className="block mb-1 text-base font-medium text-gray-900"
            >
              {activeTabLabel == "Comment"
                ? "Text"
                : "" || activeTabLabel == "Private Messages"
                ? "Text"
                : "" || activeTabLabel == "Publish"
                ? "Text"
                : ""}
            </label>
            <input
              id="choice"
              value={
                activeTabLabel === "Publish"
                  ? publishText
                  : activeTabLabel === "Comment"
                  ? comment
                  : activeTabLabel === "Private Messages"
                  ? privateMessage
                  : ""
              }
              onChange={handleChoiceChange}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg w-full mb-3 p-2 "
              required
            />
            {activeTabLabel == "Comment" ? (
              <>
                <label htmlFor="file">File upload &nbsp;</label>
                <input
                  type="file"
                  name="file"
                  id="file"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg w-full mb-3 p-2"
                  onChange={handleFileChange}
                />
              </>
            ) : (
              ""
            )}

            <label
              htmlFor="limit"
              className="block mb-1 text-base font-medium text-gray-900"
            >
              {activeTabLabel == "Comment" ||
              activeTabLabel == "Private Messages"
                ? "Limit"
                : ""}
            </label>
            {activeTabLabel == "Comment" ||
            activeTabLabel == "Private Messages" ? (
              <input
                id="limit"
                value={limit}
                onChange={handleLimitChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg w-full mb-3 p-2"
                required
              />
            ) : (
              ""
            )}
            <p>{loading? loading:""} &nbsp;&nbsp; {loading?<button onClick={()=>{
              setLoading("")
            }} className="bg-gray-200 p-1 rounded-md hover:shadow-lg">❌</button>:""} </p>
            <div className="flex justify-center">
              <button
                type="submit"
                className={`text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold px-5 py-2 my-2 text-center ${
                  isButtonDisabled() ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleSubmit}
                disabled={isButtonDisabled()}
              >
                Start
              </button>
            </div>
          </div>
        )}
      </Tabs>
    </main>
  );
}
