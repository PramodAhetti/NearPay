"use client"
import React, { useState } from "react";
import Image from "next/image";
import { AlignJustify } from "lucide-react";
import Link from "next/link";
import { signIn,signOut } from "next-auth/react";


export default function Nav() {
    const [menu, setMenu] = useState<boolean>(false);
    function dropMenu() {
        setMenu(!menu);
    }
    return (
        <nav className='p-2 row-start-1 col-start-1 col-end-13 flex flex-row justify-between items-center m-2'>
            <div className='flex flex-row items-center justify-center'>
                <Image width={30} alt='Logo' height={30} src='/bg.png' className='aspect-square m-2 rounded-full border border-white'></Image>
                <h1 className='text-xl font-extrabold text-center row-start-5 row-end-7 col-start-2 col-end-12'>NearPay</h1>
            </div>
            <AlignJustify size={30} onClick={dropMenu}></AlignJustify>
            {(menu) ? (
                        <div className="items-left m-2 p-3 absolute right-0 top-12 mt-2 w-1/2 flex flex-col justify-evenly bg-gradient-to-r from-purple-500 to-blue-400 h-auto min-h-40 rounded-md">

                        <Link
                          href="/AddPost"
                        >
                         Register 
                        </Link>
                        <button className="text-left" onClick={()=>{signOut()}}>Sign out</button>

                        <a href="#about">About</a>                      
                      
                      </div>

        ) : 
        (<></>)}
        </nav>
    )
}