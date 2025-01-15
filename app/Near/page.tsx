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
  const user = useSession();
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
    const content = postRef.current?.value;

    try {
      const formData = new FormData();
      if (content) {
        formData.append("upiId", content);
      }
      const location = await getCurLocation();
      formData.append("location", JSON.stringify(location));

      try {
        const response = await submitPost(formData);
        if (postRef.current) {
          postRef.current.value = "";
        }
        alert.success("Post submitted successfully");
        setReload(!reload);
      } catch (error) {
        console.error("Error submitting post:", error);
        alert.error("Error submitting post");
      }
    } catch (error) {
      console.error("Error compressing image:", error);
      alert.error("Error compressing image");
    }
  };

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      if (user.status === "authenticated") {
        try {
          if (user.data?.user?.image) {
            setAvatar(user.data.user.image);
          }
          if (user.data.user?.email) {
            console.log(await addUser(user.data.user.email));
          }
        } catch (error) {
          alert.error("Try again");
          console.error("Error fetching user info:", error);
        }
      } else {
        router.push("/");
      }
      try {
        const location = await getCurLocation();
        setUserLocation({latitude:location.coords.latitude,longitude:location.coords.longitude});
        const near_posts = await getPosts(location);
        console.log(near_posts);
        if (!near_posts.length) {
          console.log("No posts found near you. Try again later");
          alert.success("No posts found near you. Try again later.");
        } else {
          setPosts(near_posts);
        }
      } catch (error) {
        alert.error("Error fetching posts");
        console.error("Error fetching posts:", error);
      }
    };

    fetchUserAndPosts();
  }, [user.status, reload, router]);

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
        <input type="text" ref={postRef} placeholder="UPI ID" className="text-black w-full p-2" />
        <button type="submit" className="w-1/6 bg-white text-black flex flex-col justify-center items-center"><SendHorizontal /></button>
      </form>
      <div className="col-start-1 overflow-x-auto text-wrap col-end-13 row-start-2 row-end-12 flex flex-col m-3 text-black rounded-md">
        {user.data?.user?.email && userLocation && (
          <DisplayPosts
            posts={posts}
            user_email={user.data.user.email}
            user_location={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
          />
        )}
      </div>
    </div>
  );
}