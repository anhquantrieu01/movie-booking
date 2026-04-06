"use client"

import { SeatZone } from "@/generated/prisma/browser"
import { updateSeatZone } from "./actions"

export default function EditSeatZoneForm({ zone }: { zone: SeatZone }) {

  return (

    <form action={updateSeatZone} className="flex gap-1">

      <input type="hidden" name="id" value={zone.id} />

      <input
        name="color"
        defaultValue={zone.color || ""}
        className="border p-1 w-20"
      />

      <input
        name="startX"
        type="number"
        defaultValue={zone.startX}
        className="border p-1 w-14"
      />

      <input
        name="endX"
        type="number"
        defaultValue={zone.endX}
        className="border p-1 w-14"
      />

      <input
        name="startY"
        type="number"
        defaultValue={zone.startY}
        className="border p-1 w-14"
      />

      <input
        name="endY"
        type="number"
        defaultValue={zone.endY}
        className="border p-1 w-14"
      />

      <button className="bg-green-500 text-white px-2 rounded">
        Save
      </button>

    </form>

  )
}