"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createRoom(formData: FormData) {
  const name = formData.get("name") as string
  const cinemaId = formData.get("cinemaId") as string

  if (!name || !cinemaId) return

  await prisma.room.create({
    data: {
      name,
      cinemaId
    }
  })

  revalidatePath("/dashboard/rooms")
}

export async function updateRoom(formData: FormData) {
  const id = formData.get("id") as string
  const name = formData.get("name") as string

  if (!id || !name) return

  await prisma.room.update({
    where: { id },
    data: { name }
  })

  revalidatePath("/dashboard/rooms")
}

export async function deleteRoom(id: string) {
  await prisma.room.delete({
    where: { id }
  })

  revalidatePath("/dashboard/rooms")
}