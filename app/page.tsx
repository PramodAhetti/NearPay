import React, { useState } from 'react';
import Link from 'next/link';
import { AlignJustify, MapPin, MessageCircle } from 'lucide-react';
import GoogleLog from './component/loginGoogle';
import { getServerSession} from 'next-auth';
import { authOptions } from '@/lib/authoptions';
import Image from 'next/image';
import Nav from './component/nav';


const LandingPage =async () => {
  const user=await getServerSession(authOptions);
  let button=<GoogleLog></GoogleLog>;

  if(user){
    button=
    <Link href={'/Near'} className="row-start-7 row-end-8  col-start-2 col-end-8 text-center flex m-1 justify-center items-center flex-col text-sm  w-full text-white rounded-md font-semibold border bg-gradient-to-r from-purple-500 to-blue-400" >Get Started</Link>
  }
  return (
    
     <div className='w-full h-screen grid grid-rows-12 grid-cols-12'>  
     <Nav></Nav>
            <p className='text-white row-start-3 row-end-6 text-5xl  font-normal text-left col-start-1 col-end-13 m-5'>The Best Payment Experience.</p>
      <div className='mb-10 text-center text-sm row-start-9 col-start-2 text-gray-400 col-end-12 flex flex-row justify-evenly items-center'>
        <p className='text-left text-sm'>
        <span className='font-bold text-white'>NearPay</span> connects users to local shops for quick, secure QR code payments.</p>
      </div>
      {button}

      <div className="row-start-10 p-2 items-center flex flex-col mt-4 row-end-13 col-start-1 col-end-13">
      <Image width={280} alt='qr image' height={300} src='/upi.gif' className='rounded-md border border-white border-solid transform rotate-12 m-2'></Image>
      
      {/* About Section */}
      <div className="about-section p-6 m-8 text-left text-white bg-gradient-to-r from-purple-500 to-blue-400 rounded-lg shadow-lg">
        <h2 id="about" className="text-2xl font-extrabold mb-4">About NearPay</h2>
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