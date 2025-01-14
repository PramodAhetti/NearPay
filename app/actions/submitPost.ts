// filepath: /home/macahetti/workspace/Locial/app/actions/submitPost.ts
"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authoptions";
import { PrismaClient } from "@prisma/client";

export async function submitPost(formdata: FormData) {
  const prisma = new PrismaClient();
  try {
    console.log("formdata:", formdata);
    const session = await getServerSession(authOptions);
    let author;

    if (session?.user?.email) {
      author = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });

      if (!author) {
        throw new Error("User not found");
      }
    } else {
      throw new Error("Login required");
    }

    const coords = formdata.get("location") as string;
    const location = JSON.parse(coords);

    // Access the image file from FormData
    const file = formdata.get("file") as string;

    if (!file) {
      throw new Error("Image file is required");
    }

    // Convert the image file to a buffer

    // Save post data including the image buffer
    const post = await prisma.post.create({
      data: {
        content: formdata.get("message") as string,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        author: {
          connect: { id: author.id },
        },
        image:file,
        time: Date(), // Use current date and time
      },
    });

    return { message: "Post is saved", post };
  } catch (e) {
    console.log(e);
    throw new Error("Failed to save post");
  } finally {
    await prisma.$disconnect();
  }
}
