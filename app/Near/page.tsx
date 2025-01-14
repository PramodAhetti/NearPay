// "use client";
// import Link from "next/link";
// import {Link2, Home, SendHorizonal, Edit3, Trash2, SendHorizonalIcon, SendHorizontal, Link2Icon, LinkIcon } from "lucide-react";
// import { useSession } from "next-auth/react";
// import React, { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import Delete from "../component/delete";
// import { submitPost } from "../actions/submitPost";
// import alert from "../component/alert"
// import { getPosts} from "../actions/getPosts";
// import getCurLocation from "../actions/getLocation";
// import addUser from "../actions/addUser";
// import { lcov } from "node:test/reporters";

// export default function HomeAndNearLayout() {
//   const user = useSession();
//   const router = useRouter();
//   const postRef = useRef<HTMLInputElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [posts, setPosts] = useState<any[]>([]);
//   const [reload,setreload]=useState<boolean>(false);
//   const [avatar, setavatar] = useState<string>(
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYmkp9a2rrD1Sskb9HLt5mDaTt4QaIs8CcBg&s"
//   );

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const content = postRef.current?.value;
//     const file = fileInputRef.current?.files?.[0];

//     if (!content || !file) {
//       alert.error("Please provide content and an image.");
//       return;
//     }

//     const reader = new FileReader();
//     if(file)
//     reader.readAsDataURL(file);
//     reader.onloadend = async () => {
//       const base64data = reader.result?.toString().split(",")[1];

//       const formData = new FormData();
//       formData.append("message", content);
//       const location = await getCurLocation();
//       formData.append("location", JSON.stringify(location));
//       formData.append("file", base64data || "");

//       try {
//         const response = await submitPost(formData);
//         if(postRef.current){
//         postRef.current.value = "";
//         }
//         alert.success("Post submitted successfully");
//         setreload(!reload);
//       } catch (error) {
//         console.error("Error submitting post:", error);
//         alert.error("Error submitting post");
//       }
//     };
//   };

//   useEffect(() => {
//     const fetchUserAndPosts = async () => {
//       if (user.status=='authenticated') {
//         try {
//           if (user.data?.user?.image) {
//             setavatar(user.data.user.image);
//           }
//           if(user.data.user?.email){
//           console.log(await addUser(user.data.user.email));

//           }
//           // await axios.get("/api/users/new");
//         } catch (error) {
//           alert.error("Try again")
//           console.error("Error fetching user info:", error);
//         }
//       } else {
//         router.push("/");
//       }

//       try {
//         const location = await getCurLocation();
//         const near_posts= await getPosts(location);
//         console.log(near_posts)
//         setPosts(near_posts)
//       } catch (error) {
//         alert.error('error')
//         console.error("Error fetching posts:", error);
//       }
//     };

//     fetchUserAndPosts();
//   }, [user.status,reload, router]);

//   return (
//     <div className="h-screen w-full grid grid-cols-12 bg-zinc-800 grid-rows-12">
//       <header className="row-start-1 row-end-2 col-start-1 col-end-13 m-4 flex justify-between items-center space-x-2">
//         <Link href="/">
//           <Home className="w-8 h-8 text-white" />
//         </Link>
//         <Image
//           src={avatar}
//           width={40}
//           height={40}
//           alt="avatar"
//           style={{
//             borderRadius: 20,
//           }}
//         />
//       </header>
//       <form onSubmit={handleSubmit} className="bg-slate-600 m-1 flex flex-row rounded-lg row-start-12 row-end-13 col-start-1 col-end-13 w-full">
//         <input type="text" ref={postRef} placeholder="Message" className="text-black w-full p-2" />
//         <input type="file" id="file-input" ref={fileInputRef} className="hidden" />
//         <label htmlFor="file-input" className="w-1/6 bg-white text-black flex flex-col justify-center items-center"><LinkIcon></LinkIcon></label>
//         <button type="submit" className="w-1/6 bg-white text-black flex flex-col justify-center items-center"><SendHorizontal /></button>
//       </form>
//       <div className="col-start-1 overflow-x-auto text-wrap col-end-13 row-start-2 row-end-12 flex flex-col m-3 text-black rounded-md">
//         {posts.map((data) =>
//           user.data?.user?.email == data.author.email ? (
//             <div
//               key={data.id}
//               className="text-xs w-fit bg-emerald-200 self-end flex flex-col m-2 rounded-md"
//             >
//               <span className="bg-lime-200 p-1 font-bold w-fit rounded-lg border border-black m-1">
//                 {data.author.email.split("@")[0]}
//               </span>
//               <div className="flex flex-col justify-between p-1">

//                 {data.image && (
//                   <img
//                     src={`data:image/jpeg;base64,${data.image}`}
//                     alt="Post image"
//                     className="flex flex-row justify-center items-center w-20 h-20 object-cover rounded-lg"
//                   />
//                 )}
//                    <p className="text-sm m-1">@ {data.content}</p>
//               </div>
//               <div className="flex justify-between">
//                 <h1 className="text-xs p-2 text-zinc-500">
//                   {data.time.slice(4, 15)}
//                 </h1>
//                 <Delete id={data.id}></Delete>
//               </div>
//             </div>
//           ) : (
//             <div
//               key={data.id}
//               className="text-xs w-fit flex flex-col bg-white m-2 rounded-md"
//             >
//               <span className="bg-lime-200 p-1 font-bold w-fit rounded-lg border border-black m-1">
//                 {data.author.email.split("@")[0]}
//               </span>
//               <div className="flex flex-col justify-between mmd:hidden-1 p-1">

//                 {data.image && (
//                   <img
//                     src={`data:image/jpeg;base64,${data.image}`}
//                     alt="Post image"
//                     className="flex flex-row justify-center items-center w-20 h-20 object-cover rounded-lg"
//                   />
//                 )}
//                 <p className="text-sm m-1">@ {data.content}</p>
//               </div>
//               <div className="flex justify-between">
//                 <h1 className="text-xs p-2 text-zinc-500">
//                   {data.time.slice(4, 15)}
//                 </h1>
//               </div>
//             </div>
//           )
//         )}
//       </div>
//     </div>
//   );
// }
// filepath: /home/macahetti/workspace/Locial/app/Near/page.tsx
"use client";
import Link from "next/link";
import { Home, SendHorizontal, LinkIcon, Router } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Delete from "../component/delete";
import { submitPost } from "../actions/submitPost";
import alert from "../component/alert";
import { getPosts } from "../actions/getPosts";
import getCurLocation from "../actions/getLocation";
import addUser from "../actions/addUser";
import imageCompression from "browser-image-compression";
import DisplayPosts from "../component/displayPosts";

export default function HomeAndNearLayout() {
  const user = useSession();
  const router = useRouter();
  const postRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [reload, setReload] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYmkp9a2rrD1Sskb9HLt5mDaTt4QaIs8CcBg&s"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = postRef.current?.value;
    const file = fileInputRef.current?.files?.[0];

    if (!content || !file) {
      alert.error("Please provide content and an image.");
      return;
    }

    try {
      // Compress the image
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = async () => {
        const base64data = reader.result?.toString().split(",")[1];

        const formData = new FormData();
        formData.append("message", content);
        const location = await getCurLocation();
        formData.append("location", JSON.stringify(location));
        formData.append("file", base64data || "");

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
      };
    } catch (error) {
      console.error("Error compressing image:", error);
      alert.error("Error compressing image");
    }
  };

  // const getCurLocation = (): Promise<{ latitude: number; longitude: number }> => {
  //   return new Promise((resolve, reject) => {
  //     if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(
  //         (position) => {
  //           resolve({
  //             latitude: position.coords.latitude,
  //             longitude: position.coords.longitude,
  //           });
  //         },
  //         (error) => {
  //           console.error("Error getting location:", error);
  //           reject(error);
  //         }
  //       );
  //     } else {
  //       reject(new Error("Geolocation is not supported by this browser."));
  //     }
  //   });
  // };

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      if (user.status === "authenticated") {
        try { if (user.data?.user?.image) { setAvatar(user.data.user.image); } if (user.data.user?.email) { console.log(await addUser(user.data.user.email)); } } catch (error) { alert.error("Try again"); console.error("Error fetching user info:", error); }
      } else { router.push("/"); } try {
        const location = await getCurLocation(); const near_posts = await getPosts(location);
        console.log(near_posts);
        setPosts(near_posts);
      } catch (error) {
        alert.error("Error fetching posts");
        console.error("Error fetching posts:", error);
      }
    };

    fetchUserAndPosts();
  }, [user.status, reload,router]);

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
        <input type="text" ref={postRef} placeholder="Message" className="text-black w-full p-2" />
        <input type="file" id="file-input" ref={fileInputRef} className="hidden" />
        <label htmlFor="file-input" className="w-1/6 bg-white text-black flex flex-col justify-center items-center"><LinkIcon></LinkIcon></label>
        <button type="submit" className="w-1/6 bg-white text-black flex flex-col justify-center items-center"><SendHorizontal /></button>
      </form>
      <div className="col-start-1 overflow-x-auto text-wrap col-end-13 row-start-2 row-end-12 flex flex-col m-3 text-black rounded-md">
        {user.data?.user?.email && <DisplayPosts posts={posts} user_email={user.data.user.email} />}
      </div>
    </div>
  );
}