"use server";

import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import slugify from "slugify";
import { revalidatePath } from "next/cache";
import { AgeRating, MovieStatus } from "@/generated/prisma/enums";

export async function createMovie(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const duration = Number(formData.get("duration"));
  const releaseDate = formData.get("releaseDate") as string;
  const status = formData.get("status") as MovieStatus;
  const language = formData.get("language") as string;
  const country = formData.get("country") as string;
  const ageRating = formData.get("ageRating") as AgeRating;
  const trailerUrl = formData.get("trailerUrl") as string;

  const file = formData.get("poster") as File;

  const slug = slugify(title, { lower: true, strict: true, locale: "vi" });

  let posterUrl = "";
  let posterId = "";

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "movies" }, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        })
        .end(buffer);
    });

    posterUrl = result.secure_url;
    posterId = result.public_id;
  }

  await prisma.movie.create({
    data: {
      title,
      slug,
      description,
      duration,
      releaseDate: new Date(releaseDate),
      status,
      language,
      country,
      ageRating,
      posterUrl,
      posterId,
      trailerUrl,
    },
  });

  revalidatePath("/dashboard/movies");
}
export async function updateMovie(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const duration = Number(formData.get("duration"));
  const status = formData.get("status") as MovieStatus;
  const language = formData.get("language") as string;
  const country = formData.get("country") as string;
  const ageRating = formData.get("ageRating") as AgeRating;
  const trailerUrl = formData.get("trailerUrl") as string;

  const slug = slugify(title, { lower: true, strict: true });

  await prisma.movie.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      duration,
      status,
      language,
      country,
      ageRating,
      trailerUrl,
    },
  });

  revalidatePath("/dashboard/movies");
}

export async function deleteMovie(id: string, posterId?: string) {
  if (posterId) {
    await cloudinary.uploader.destroy(posterId);
  }

  await prisma.movie.delete({
    where: { id },
  });

  revalidatePath("/dashboard/movies");
}
