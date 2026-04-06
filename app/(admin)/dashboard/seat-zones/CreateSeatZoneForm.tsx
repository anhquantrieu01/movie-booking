"use client"

import { Room } from "@/generated/prisma/client"
import { createSeatZone } from "./actions"

export default function CreateSeatZoneForm({ rooms }: { rooms: Room[] }) {

  return (

    <form
      action={createSeatZone}
      className="flex flex-wrap gap-2 bg-gray-50 p-4 rounded"
    >

      <select name="roomId" className="border p-2">

        {rooms.map((r: Room) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}

      </select>

      <input name="color" placeholder="color (#ff0000)" className="border p-2" />

      <input name="startX" type="number" placeholder="startX" className="border p-2 w-20" />
      <input name="endX" type="number" placeholder="endX" className="border p-2 w-20" />

      <input name="startY" type="number" placeholder="startY" className="border p-2 w-20" />
      <input name="endY" type="number" placeholder="endY" className="border p-2 w-20" />

      <button className="bg-blue-500 text-white px-4 rounded">
        Create
      </button>

    </form>

  )
}