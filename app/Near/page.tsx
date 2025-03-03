"use client";
import Link from "next/link";
import { Home } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getPosts } from "../actions/getPosts";
import getCurLocation from "../actions/getLocation";
import addUser from "../actions/addUser";
import DisplayPosts from "../component/displayPosts";
import alert from "../component/alert";

export default function HomeAndNearLayout() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [reload, setReload] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYmkp9a2rrD1Sskb9HLt5mDaTt4QaIs8CcBg&s"
  );
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

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
          if (nearPosts) {
            setPosts(nearPosts);
          } else {
            alert.error("No posts found");
          }
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        alert.error("Error fetching posts");
      }
    };

    fetchUserAndPosts();
  }, [status, reload, router, session]);

  const SkeletonLoader = () => (
    <div className="animate-pulse bg-gray-300 p-4 rounded-md m-3">
      <div className="h-4 bg-gray-400 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-400 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-400 rounded w-full"></div>
    </div>
  );

  return (
    <div className="h-screen w-full grid grid-cols-12 bg-zinc-800 grid-rows-13">
      <header className="row-start-1 row-end-1 col-start-1 col-end-13 h-12 m-4 flex justify-between items-center">
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

      <div className="col-start-1 col-end-13 row-start-2 row-end-13 overflow-y-auto flex flex-col text-black rounded-md">
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
          <div className="flex flex-col">
            {Array(8)
              .fill(0)
              .map((_, index) => (
                <SkeletonLoader key={index} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
