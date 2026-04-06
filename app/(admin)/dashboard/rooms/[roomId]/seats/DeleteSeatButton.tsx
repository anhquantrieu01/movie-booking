"use client"

import { deleteSeat } from "./actions"

export default function DeleteSeatButton({
  id,
  roomId
}:{id:string,roomId:string}){

  return (

    <button
      onClick={()=>deleteSeat(id,roomId)}
      className="text-red-600 text-sm"
    >
      ✕
    </button>

  )
}