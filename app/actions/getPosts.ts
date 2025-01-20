"use server"
import { authOptions } from "@/lib/authoptions";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { getServerSideProps } from "next/dist/build/templates/pages";


type Location = {
    coords: {
      latitude: number;
      longitude: number;
    };
  };


const radius=0.0009;
export async function getPosts(coords:Location){
  const prisma=new PrismaClient();
  try{
    const user=await getServerSession(authOptions);
    if(!user){
      throw new Error("unauthorized");
    }
       const posts = await prisma.post.findMany({
            where:{
                latitude:{gte:coords.coords.latitude-radius,lte:coords.coords.latitude+radius},
                longitude:{gte:coords.coords.longitude-radius,lte:coords.coords.longitude+radius}
            },
            include: {
                author: true, // Include author details
            },
        });

        return posts;
  }catch(error){
      const err=error as Error;
      throw new Error(err.message);
  } finally {
    await prisma.$disconnect();
  }
  }