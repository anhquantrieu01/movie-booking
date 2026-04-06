"use client"

import { createSeat } from "./actions"

export default function CreateSeatForm({
  roomId
}:{roomId:string}){

  return (

    <form
      action={createSeat}
      className="flex flex-wrap gap-2 bg-red-50 p-4 rounded"
    >

      <input type="hidden" name="roomId" value={roomId} />

      <input
        name="row"
        placeholder="Row (A)"
        className="border p-2 rounded w-24"
      />

      <input
        name="number"
        placeholder="Number"
        type="number"
        className="border p-2 rounded w-24"
      />

      <button
        className="bg-red-600 text-white px-4 rounded"
      >
        Add Seat
      </button>

    </form>

  )
}