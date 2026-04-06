"use client"

import { deleteRoom } from "./actions"

export default function DeleteRoomButton({ id }: { id:string }) {

  return (
    <button
      onClick={()=>deleteRoom(id)}
      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
    >
      Delete
    </button>
  )
}