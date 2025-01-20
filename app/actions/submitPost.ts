"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authoptions";
import { PrismaClient } from "@prisma/client";

export async function submitPost(formdata: FormData) {
  const prisma = new PrismaClient();
  try {
    const session = await getServerSession(authOptions);
    if(!session){
       throw new Error("Unauthorized");
    }
    let author;

    if (session?.user?.email) {
      author = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });

      if (!author) {
        throw new Error("User not found");
      }else{
        if(!author.owner){
          throw new Error("Become a owner to submit post")
        }
      }
    } else {
      throw new Error("Login required");
    }

    const coords = formdata.get("location") as string;
    const location = JSON.parse(coords);
    const upiId = formdata.get("upiId") as string;
    const shopName = formdata.get("shopName") as string;

    // Save post data including the shop name
    const post = await prisma.post.create({
      data: {
        upiId: upiId,
        shopName: shopName,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        author: {
          connect: { id: author.id },
        },
        time: Date(), // Use current date and time
      },
    });

    return { message: "Post is saved"};
  } catch (e) {
    const error=e as Error;
    throw new Error(error.message);
  } finally {
    await prisma.$disconnect();
  }
}