"use client"

import { createContext,  useReducer } from "react";




export const UserContext=createContext();

const initialState={
    loggedIn:false,
    userData:{},
    facebookData:[],
    instagramData:[]
}

  const callReducer = (state, action) => {
    switch (action.type) {
      case 'Log In':
        return {
          ...state,
          loggedIn: action.payload.login,
          userData:action.payload.userData
         
        };
   
      case 'set-user':
       
        return {
          ...state,
          userData: action.payload
        };
      case 'set facebookData':
        return {
          ...state,
          facebookData: action.payload
        };
      case 'set instagramData':
        return {
          ...state,
          instagramData:action.payload
        }  
      default:
        return state;
    }
  };

export const UserProvider=({children})=>{

    // const [loggedIn,setIsLoggedIn]=useState(false)
    const[state,dispatch]=useReducer(callReducer,initialState)
    

   return <UserContext.Provider value={{state,dispatch}}>
             {children}
    </UserContext.Provider>

}