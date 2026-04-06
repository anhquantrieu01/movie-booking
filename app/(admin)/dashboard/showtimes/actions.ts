"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createShowtime(formData: FormData) {
  const movieId = formData.get("movieId") as string
  const roomId = formData.get("roomId") as string
  const startTime = new Date(formData.get("startTime") as string)
  const price = Number(formData.get("price"))

  await prisma.$transaction(async (tx) => {
    // 🔥 lấy duration
    const movie = await tx.movie.findUnique({
      where: { id: movieId },
      select: { duration: true }
    })

    if (!movie) throw new Error("Movie not found")
      const BUFFER_MINUTES = 10
    const endTime = new Date(
  startTime.getTime() + (movie.duration + BUFFER_MINUTES) * 60000
)

    // 🔥 check overlap trực tiếp DB
    const conflict = await tx.showtime.findFirst({
      where: {
        roomId,
        AND: [
          { startTime: { lt: endTime } },
          { endTime: { gt: startTime } }
        ]
      }
    })

    if (conflict) {
      throw new Error("Phòng đã có suất chiếu trùng thời gian")
    }

    // ✅ create
    await tx.showtime.create({
      data: {
        movieId,
        roomId,
        startTime,
        endTime,
        price
      }
    })
  })

  revalidatePath("/dashboard/showtimes")
}

export async function updateShowtime(id: string, formData: FormData) {
  const movieId = formData.get("movieId") as string
  const roomId = formData.get("roomId") as string
  const startTime = new Date(formData.get("startTime") as string)
  const price = Number(formData.get("price"))

  await prisma.$transaction(async (tx) => {
    const movie = await tx.movie.findUnique({
      where: { id: movieId },
      select: { duration: true }
    })

    if (!movie) throw new Error("Movie not found")
 const BUFFER_MINUTES = 10
const endTime = new Date(
  startTime.getTime() + (movie.duration + BUFFER_MINUTES) * 60000
)
    // 🔥 check overlap (exclude current)
    const conflict = await tx.showtime.findFirst({
      where: {
        roomId,
        id: { not: id },
        AND: [
          { startTime: { lt: endTime } },
          { endTime: { gt: startTime } }
        ]
      }
    })

    if (conflict) {
      throw new Error("Phòng đã có suất chiếu trùng thời gian")
    }

    await tx.showtime.update({
      where: { id },
      data: {
        movieId,
        roomId,
        startTime,
        endTime,
        price
      }
    })
  })

  revalidatePath("/dashboard/showtimes")
}

export async function deleteShowtime(id: string) {
  await prisma.$transaction(async (tx) => {
    // 🔥 check booking tồn tại
    const booking = await tx.booking.findFirst({
      where: { showtimeId: id }
    })

    if (booking) {
      throw new Error("Không thể xóa suất chiếu đã có người đặt")
    }

    await tx.showtime.delete({
      where: { id }
    })
  })

  revalidatePath("/dashboard/showtimes")
}