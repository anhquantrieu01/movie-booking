"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createSeat(formData: FormData) {

  const row = formData.get("row") as string
  const number = Number(formData.get("number"))
  const roomId = formData.get("roomId") as string

  if(!row || !number) return

  await prisma.seat.create({
    data:{
      row,
      number,
      roomId
    }
  })

  revalidatePath(`/dashboard/rooms/${roomId}/seats`)
}


export async function deleteSeat(id:string, roomId:string){

  await prisma.seat.delete({
    where:{ id }
  })

  revalidatePath(`/dashboard/rooms/${roomId}/seats`)
}