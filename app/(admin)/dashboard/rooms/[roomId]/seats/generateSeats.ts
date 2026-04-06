
"use server"

import { SeatType } from "@/generated/prisma/enums"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function generateSeats(formData: FormData) {
  const roomId = formData.get("roomId") as string
  const rows = formData.get("rows") as string       // ví dụ "A-L"
  const seatsPerRow = Number(formData.get("seats"))
  const verticalAisles = (formData.get("verticalAisles") as string || "")
    .split(",")
    .map(a => Number(a.trim()))
    .filter(Boolean)
  const horizontalAisles = (formData.get("horizontalAisles") as string || "")
    .split(",")
    .map(r => r.trim().toUpperCase())
    .filter(Boolean)

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const [start, end] = rows.split("-")
  const startIndex = alphabet.indexOf(start)
  const endIndex = alphabet.indexOf(end)
  const rowList = alphabet.slice(startIndex, endIndex + 1).split("")

  const seats = []
  for (const row of rowList) {
    for (let number = 1; number <= seatsPerRow; number++) {
      seats.push({
        roomId,
        row,
        number,
        type: SeatType.NORMAL
      })
    }
  }

  // Xóa ghế cũ nếu có
  await prisma.seat.deleteMany({ where: { roomId } })

  // Tạo ghế mới
  await prisma.seat.createMany({ data: seats })

  // Lưu layout metadata vào Room
  await prisma.room.update({
    where: { id: roomId },
    data: {
      verticalAisles,
      horizontalAisles
    }
  })

  // Revalidate dashboard
  revalidatePath("/dashboard/rooms")
}