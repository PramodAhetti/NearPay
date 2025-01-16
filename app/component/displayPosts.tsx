'use client';
import React from "react";
import Delete from "../component/delete";

// Function to extract details from UPI URL
const extractUPIDetails = (upiUrl: string) => {
  const url = new URL(upiUrl);
  
  const params = url.searchParams;
  const upiId = params.get("pa") || "";
  const [username, domain] = upiId.split('@');
  const name = params.get("pn") || "";
  const purpose = params.get("purpose") || "";
  return { username, domain, name, purpose };
};

// Function to calculate distance between two locations
const calculateDistance = (loc1 : Location, loc2:Location) => {
  const dLat = (loc2.latitude - loc1.latitude) 
  const dLon = (loc2.longitude - loc1.longitude)
  const distance = (dLat*dLat)+(dLon*dLon) ; // Distance in km
  return distance;
};

type Location = {
  latitude: number,
  longitude: number
};

type Post = {
  id: string;
  upiId: string;
  author: {
    email: string;
  };
  latitude: number;
  longitude: number;
  time: string;
  image?: string;
};

type Props = {
  posts: Post[];
  user_email: string;
  user_location: { latitude: number; longitude: number };
};

const DisplayPosts: React.FC<Props> = ({ posts, user_email, user_location }) => {
  return (
    <div className="col-start-1 overflow-x-auto text-wrap col-end-13 row-start-2 row-end-12 flex flex-col m-3 text-black rounded-md">
      {posts.map((data) => {
        const { username, domain, name, purpose } = extractUPIDetails(data.upiId);
        let distance = calculateDistance(user_location, { latitude: data.latitude, longitude: data.longitude });
        let bgColor;
        distance=distance*10000000000;
        distance=distance%10;
        console.log("distance",distance)
        if (distance < 3.5) {
          bgColor = 'bg-green-400';
        } else if (distance < 7 ) {
          bgColor = 'bg-yellow-400';
        } else {
          bgColor = 'bg-red-400';
        }

        return user_email === data.author.email ? (
          <div key={data.id} className={`text-xs w-fit ${bgColor} self-end flex flex-col p-2 m-2 rounded-md`}>
            <div className="flex flex-col justify-between p-1">
              <div className="flex flex-col justify-start pt-2">
                <span className="bg-lime-200 bg-gradient-to-r from-purple-400 to-blue-400 font-bold w-fit rounded-lg border border-black m-1">

                  <h1 className="text-base p-2 text-black">{username}@{domain} </h1>
                </span>
                <a className="text-sm m-1 bg-white rounded-lg border border-black text-center p-1" href={data.upiId}>
                  Pay Now
                </a>
              </div>
            </div>
            <div className="flex justify-between">
              <h1 className="text-xs p-2 text-zinc-00">{data.time.slice(4, 15)}</h1>
              <Delete id={data.id}></Delete>
            </div>
          </div>
        ) : (
          <div key={data.id} className={`text-xs w-fit ${bgColor} flex flex-col m-2 p-2 rounded-md`}>
            <div className="flex flex-col justify-between p-1">
              <div className="flex flex-col justify-start pt-2">
                <span className="bg-lime-200 bg-gradient-to-r from-purple-500 to-blue-400 p-1 font-bold w-fit rounded-lg border border-black m-1">
                  <h1 className="text-lg p-2 text-black">{username}</h1>
                </span>
                <a className="text-sm m-1 bg-white rounded-lg border border-black text-center p-1" href={data.upiId}>
                  Pay Now
                </a>
              </div>
            </div>
            <div className="flex justify-between">
              <h1 className="text-xs p-2 text-zinc-600">{data.time.slice(4, 15)}</h1>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DisplayPosts;
