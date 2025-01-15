"use client";
import Link from "next/link";
import { Home, SendHorizontal } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { submitPost } from "../actions/submitPost";
import alert from "../component/alert";
import { getPosts } from "../actions/getPosts";
import getCurLocation from "../actions/getLocation";
import addUser from "../actions/addUser";
import DisplayPosts from "../component/displayPosts";

export default function HomeAndNearLayout() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const postRef = useRef<HTMLInputElement>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [reload, setReload] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYmkp9a2rrD1Sskb9HLt5mDaTt4QaIs8CcBg&s"
  );
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = postRef.current?.value?.trim();
    if (!content) {
      alert.error("UPI ID cannot be empty");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("upiId", content);
      const location = await getCurLocation();
      if (location) {
        formData.append("location", JSON.stringify(location));
      }

      const response = await submitPost(formData);
      if(postRef.current){
      postRef.current.value = "";
      }
      alert.success("Post submitted successfully");
      setReload(!reload);
    } catch (error) {
      console.error("Error submitting post:", error);
      alert.error("Error submitting post");
    }
  };

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      if (status === "authenticated") {
        try {
          if (session?.user?.image) setAvatar(session.user.image);
          if (session?.user?.email) await addUser(session.user.email);
        } catch (error) {
          console.error("Error fetching user info:", error);
          alert.error("Error fetching user info");
        }
      } else {
        router.push("/");
      }

      try {
        const location = await getCurLocation();
        if (location) {
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });

          const nearPosts = await getPosts(location);
          if (nearPosts.length === 0) {
            alert.success("No posts found near you. Try again later.");
          } else {
            setPosts(nearPosts);
          }
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        alert.error("Error fetching posts");
      }
    };

    fetchUserAndPosts();
  }, [status, reload, router, session]);

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
      <form onSubmit={handleSubmit} className="bg-slate-600 m-1 flex flex-row rounded-lg row-start-12 row-end-13 col-start-1 col-end-13 w-full">
        <input
          type="text"
          ref={postRef}
          placeholder="UPI ID"
          className="text-black w-full p-2"
        />
        <button type="submit" className="w-1/6 bg-white text-black flex flex-col justify-center items-center">
          <SendHorizontal />
        </button>
      </form>
      <div className="col-start-1 low-x-auto text-wrap col-end-13 row-start-2 row-end-12 flex flex-col m-3 text-black rounded-md">
        {session?.user?.email && userLocation ? (
          <DisplayPosts
            posts={posts}
            user_email={session.user.email}
            user_location={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
          />
        ) : (
          <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-5 border-b-2 border-white"></div>
        </div>
        )}
      </div>
    </div>
  );
}
