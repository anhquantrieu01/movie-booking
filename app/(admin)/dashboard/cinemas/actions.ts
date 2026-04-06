"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createCinema(formData: FormData) {
  const name = formData.get("name") as string
  const address = formData.get("address") as string

  if (!name || !address) {
    throw new Error("Missing fields")
  }

  await prisma.cinema.create({
    data: {
      name,
      address
    }
  })

  revalidatePath("/dashboard/cinemas")
}

export async function updateCinema(id: string, formData: FormData) {
  const name = formData.get("name") as string
  const address = formData.get("address") as string

  await prisma.cinema.update({
    where: { id },
    data: {
      name,
      address
    }
  })

  revalidatePath("/dashboard/cinemas")
}

export async function deleteCinema(id: string) {
  await prisma.cinema.delete({
    where: { id }
  })

  revalidatePath("/dashboard/cinemas")
}