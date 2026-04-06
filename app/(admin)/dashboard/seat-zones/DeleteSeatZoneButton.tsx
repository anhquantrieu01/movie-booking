"use client"

import { deleteSeatZone } from "./actions"

export default function DeleteSeatZoneButton({ id }: { id: string }) {

  return (

    <button
      onClick={() => deleteSeatZone(id)}
      className="bg-red-500 text-white px-2 rounded"
    >
      Delete
    </button>

  )
}