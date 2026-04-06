"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// CREATE
export async function createSeatZone(formData: FormData) {
  const roomId = formData.get("roomId") as string
  const color = formData.get("color") as string
  const startX = Number(formData.get("startX"))
  const endX = Number(formData.get("endX"))
  const startY = Number(formData.get("startY"))
  const endY = Number(formData.get("endY"))

  await prisma.seatZone.create({
    data: {
      roomId,
      color,
      startX,
      endX,
      startY,
      endY
    }
  })

  revalidatePath("/dashboard/seat-zones")
}

// UPDATE
export async function updateSeatZone(formData: FormData) {
  const id = formData.get("id") as string
  const color = formData.get("color") as string
  const startX = Number(formData.get("startX"))
  const endX = Number(formData.get("endX"))
  const startY = Number(formData.get("startY"))
  const endY = Number(formData.get("endY"))

  await prisma.seatZone.update({
    where: { id },
    data: {
      color,
      startX,
      endX,
      startY,
      endY
    }
  })

  revalidatePath("/dashboard/seat-zones")
}

// DELETE
export async function deleteSeatZone(id: string) {
  await prisma.seatZone.delete({
    where: { id }
  })

  revalidatePath("/dashboard/seat-zones")
}