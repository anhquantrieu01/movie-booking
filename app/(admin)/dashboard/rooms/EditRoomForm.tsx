"use client"

import { useState } from "react"
import { updateRoom } from "./actions"
import { Room } from "@/generated/prisma/client"

export default function EditRoomForm({ room }: { room: Room }) {

  const [open,setOpen] = useState(false)

  if(!open)
    return (
      <button
        onClick={()=>setOpen(true)}
        className="bg-yellow-500 text-white px-3 py-1 rounded"
      >
        Edit
      </button>
    )

  return (

    <form
      action={updateRoom}
      className="flex gap-2"
    >

      <input type="hidden" name="id" value={room.id} />

      <input
        name="name"
        defaultValue={room.name}
        className="border p-1 rounded"
      />

      <button className="bg-red-600 text-white px-3 rounded">
        Save
      </button>

      <button
        type="button"
        onClick={()=>setOpen(false)}
        className="px-3 border rounded"
      >
        Cancel
      </button>

    </form>

  )
}