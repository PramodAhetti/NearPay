'use client';
import React from "react";
import Delete from "../component/delete";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";

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
const calculateDistance = (loc1: Location, loc2: Location) => {
  const dLat = loc2.latitude - loc1.latitude;
  const dLon = loc2.longitude - loc1.longitude;
  const distance = dLat * dLat + dLon * dLon; // Distance in a simplified unit
  return distance;
};

// Normalize distances between 0 and 1
const normalizeDistances = (distances: number[]) => {
  const minValue = Math.min(...distances);
  const maxValue = Math.max(...distances);

  // Avoid division by zero if all distances are the same
  if (minValue === maxValue) {
    return distances.map(() => 0.5); // Use a neutral value
  }

  return distances.map(distance => (distance - minValue) / (maxValue - minValue));
};

type Location = {
  latitude: number;
  longitude: number;
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
  shopName?: string;
};

type Props = {
  posts: Post[];
  user_email: string;
  user_location: { latitude: number; longitude: number };
};

const DisplayPosts: React.FC<Props> = ({ posts, user_email, user_location }) => {
  // Calculate distances for all posts
  const distances = posts.map(data =>
    calculateDistance(user_location, { latitude: data.latitude, longitude: data.longitude })
  );

  // Normalize the distances
  const normalizedDistances = normalizeDistances(distances);

  // Function to download the entire post as an image
  const downloadPost = (id: string) => {
    const postElement = document.getElementById(id);
    if (postElement) {
      html2canvas(postElement).then(canvas => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "post-image.png";
        link.click();
      });
    }
  };

  return (
    <div className="col-start-1 overflow-x-auto text-wrap col-end-13 row-start-2 row-end-12 flex flex-col m-3 text-black rounded-md">
      {posts.map((data, index) => {
        const { username, domain } = extractUPIDetails(data.upiId);

        // Get normalized distance for the current post
        const normalizedDistance = normalizedDistances[index];

        // Determine background color based on normalized distance
        let bgColor;
        if (normalizedDistance < 0.33) {
          bgColor = 'bg-green-400'; // Closest
        } else if (normalizedDistance < 0.66) {
          bgColor = 'bg-yellow-400'; // Medium distance
        } else {
          bgColor = 'bg-red-400'; // Farthest
        }

        // Determine the action label based on the URL type
        const isUPI = data.upiId.startsWith("upi:");
        const actionLabel = isUPI ? "Pay Now" : "Visit";

        return user_email === data.author.email ? (
          <div id={`post-${data.id}`} key={data.id} className={`text-xs w-fit ${bgColor} self-end flex flex-col p-2 m-2 rounded-md`}>
            <div className="flex flex-col justify-between p-1">
              <div className="flex flex-col justify-start pt-2">
                <span className="bg-lime-200 bg-gradient-to-r from-purple-400 to-blue-400 font-bold w-fit rounded-lg border border-black m-1">

                  <h1 className="text-base p-2 text-black">{data.shopName}</h1>
                </span>
                <div id={`qr-code-${data.id}`} className="m-1 rounded-lg">
                  <QRCode size={150} value={data.upiId} />

                </div>

                <button 
                  className="text-sm m-1 border border-black bg-blue-500 rounded-lg text-white p-1"
                  onClick={() => downloadPost(`post-${data.id}`)}>
                  Download 
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <h1 className="text-xs p-2 text-zinc-00">{data.time.slice(4, 15)}</h1>
              <Delete id={data.id}></Delete>
            </div>
          </div>
        ) : (
          <div id={`post-${data.id}`} key={data.id} className={`text-xs w-fit ${bgColor} flex flex-col m-2 p-2 rounded-md`}>
            <div className="flex flex-col justify-between p-1">
              <div className="flex flex-col justify-start pt-2">
                <span className="bg-lime-200 bg-gradient-to-r from-purple-500 to-blue-400 p-1 font-bold w-fit rounded-lg border border-black m-1">
                  <h1 className="text-base p-2 text-black">{data.shopName}</h1>
                </span>
                <div id={`qr-code-${data.id}`} className="m-1 rounded-lg">
                  <QRCode size={150} value={data.upiId} />
                </div>

                <button 
                  className="text-sm m-1 border border-black bg-blue-500 rounded-lg text-white p-1"
                  onClick={() => downloadPost(`post-${data.id}`)}>
                  Download 
                </button>
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
