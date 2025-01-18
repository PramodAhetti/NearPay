"use client";
import React, { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Home, SendHorizontal } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { submitPost } from "../actions/submitPost";
import alert from "../component/alert";
import getCurLocation from "../actions/getLocation";

function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    // Check if the protocol is either HTTPS or UPI
    return parsedUrl.protocol === "https:" || parsedUrl.protocol === "upi:";
  } catch (err) {
    return false;
  }
}

export default function AddPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const postRef = useRef<HTMLInputElement>(null);
  const shopNameRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string>(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYmkp9a2rrD1Sskb9HLt5mDaTt4QaIs8CcBg&s"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const content = postRef.current?.value?.trim();
      const shopName = shopNameRef.current?.value?.trim();
      console.log("url", content);
      if (!content || !isValidUrl(content)) {
        throw new Error("UPI ID cannot be empty or invalid");
      }
      if (!shopName) {
        throw new Error("Shop name cannot be empty");
      }

      const formData = new FormData();
      formData.append("upiId", content);
      formData.append("shopName", shopName);
      const location = await getCurLocation();
      if (location) {
        formData.append("location", JSON.stringify(location));
      }

      const response = await submitPost(formData);
      if (postRef.current) {
        postRef.current.value = "";
      }
      if (shopNameRef.current) {
        shopNameRef.current.value = "";
      }
      alert.success("Post submitted successfully");
    } catch (error) {
      alert.error("Error submitting post");
    }
  };

  return (
    <div className="h-screen w-full grid grid-cols-12 bg-zinc-800 grid-rows-12">
      <header className="row-start-1 row-end-2 col-start-1 col-end-13 m-4 flex justify-between items-center space-x-2">
        <Link href="/">
          <Home className="w-8 h-8 text-white" />
        </Link>
        <Image
          src={avatar}
          width={40}
          height={40}
          alt="avatar"
          style={{
            borderRadius: 20,
          }}
        />
      </header>
      <form onSubmit={handleSubmit} className="bg-gradient-to-r from-purple-500 to-blue-400 m-1 flex flex-col justify-center rounded-lg row-start-5 row-end-10 col-start-2 col-end-12 w-full p-4">
        <div className="text-black w-full p-2 mb-2 text-center rounded-lg">Register Shop</div>
        <input
          type="text"
          ref={shopNameRef}
          placeholder="Enter Shop Name"
          className="text-black w-full p-2 mb-2 rounded-lg border border-black"
        />
        <input
          type="text"
          ref={postRef}
          placeholder="Enter a UPI ID"
          className="text-black w-full p-2 mb-2 rounded-lg border border-black"
        />
        <button type="submit" className="w-full m-1 bg-blue-500 text-white flex flex-col justify-center items-center p-2 rounded-lg border border-black">
          Submit
        </button>
      </form>
    </div>
  );
}