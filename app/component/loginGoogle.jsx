"use client"
import React from 'react'
import { useSession,signIn,signOut } from 'next-auth/react'
export default function LoginButton() {
  return (
    <button onClick={()=>{signIn()}} className="text-center flex justify-center items-center flex-col text-sm w-full row-start-7 row-end-8 md-2 col-start-2 col-end-8 bg-gradient-to-r from-purple-500 to-blue-400 text-white rounded-md font-semibold border border-black hover:bg-gray-500" >
      Login In
  </button>
  )
}
