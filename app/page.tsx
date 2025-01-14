import React, { useState } from 'react';
import Link from 'next/link';
import { AlignJustify, MapPin, MessageCircle } from 'lucide-react';
import GoogleLog from './component/loginGoogle';
import { useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authoptions';
import Image from 'next/image';
import { redirect } from 'next/navigation';
const LandingPage =async () => {
  const user=await getServerSession(authOptions);
  let button=<GoogleLog></GoogleLog>;

  if(user){
    button=<Link href={'/Near'} className="text-center flex justify-center items-center flex-col text-sm  w-full row-start-7 row-end-8 md-2 col-start-2 col-end-8 text-white rounded-md font-semibold border bg-gradient-to-r from-purple-500 to-blue-400" >Get Started</Link>  }
  return (
    
     <div className='w-full h-screen grid grid-rows-12 grid-cols-12'>  
     <nav className='p-2 row-start-1 col-start-1 col-end-13 flex flex-row justify-between items-center m-2'>
      <div className='flex flex-row items-center justify-center'>
     <Image width={30} alt='Logo' height={30} src='/bg.png' className='aspect-square m-2 rounded-full border border-white'></Image>
       <h1 className='text-xl font-extrabold text-center row-start-5 row-end-7 col-start-2 col-end-12'>NearPay</h1> 
</div>
       <AlignJustify size={30}></AlignJustify>
       </nav>
      {/* <div className='flex justify-center items-center row-start-2 row-end-4 col-start-5 col-end-9'>
         <MapPin size={150} ></MapPin>
      </div> */}
      {/* <Image alt='fractal' src='/qr.gif' className='row-start-3 rounded-full row-end-6 col-start-4 col-end-10' width={600} height={600}></Image> */}
      <p className='text-white row-start-3 row-end-6 text-5xl  font-normal text-left col-start-1 col-end-13 m-5'>The Best Payment Experience.</p>
      <div className='mb-10 text-center text-sm row-start-9 col-start-2 text-gray-400 col-end-12 flex flex-row justify-evenly items-center'>
        <p className='text-left text-sm'>
        <span className='font-bold text-white'>NearPay</span> connects users to local shops for quick, secure QR code payments.</p>
      </div>
      {button}

      <div className="row-start-10 p-2 items-center flex flex-col mt-4 row-end-13 col-start-1 col-end-13">
      <Image width={200} alt='qr image' height={300} src='/qr1.gif' className='transform rotate-12 m-2'></Image>
      
      {/* About Section */}
      <div className="about-section p-6 m-8 text-left text-white bg-gradient-to-r from-purple-500 to-blue-400 rounded-lg shadow-lg">
        <h2 className="text-2xl font-extrabold mb-4">About NearPay</h2>
        <p className="text-sm mb-4">
          At NearPay, we are passionate about revolutionizing the payment experience. Our platform seamlessly connects
          users with local shops, enabling quick and secure transactions through cutting-edge QR code technology.
        </p>
        <p className="text-sm">
          Whether you're grabbing a coffee or shopping for groceries, NearPay ensures your payments are fast, safe, and
          hassle-free. Join us in transforming the way you pay!
        </p>
      </div>

      <footer className="w-full mt-7 p-4 text-center text-sm text-zinc-500 border-t border-gray-200">
        <p>&copy; 2025 NearPay. All rights reserved.</p>
      </footer>
      </div>

    </div>
    
  )
};

export default LandingPage;