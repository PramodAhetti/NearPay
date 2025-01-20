"use server"
import { PrismaClient } from "@prisma/client";


export default async function addUser(email:string){
    const prisma=new PrismaClient();
   try{
     if(await prisma.user.findUnique({where:{email:email}})){
         return {data:"user already exists"};
        }
     await prisma.user.create({data:{email:email}});
     return {data:"user added"};
   }catch(e){
    throw new Error("Failed to add user");
   }
}