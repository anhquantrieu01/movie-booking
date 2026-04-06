"use client"

import { Cinema } from "@/generated/prisma/client"
import { createRoom } from "./actions"

export default function CreateRoomForm({ cinemas }: { cinemas: Cinema[]}) {

  return (

    <form
      action={createRoom}
      className="grid md:grid-cols-3 gap-3 bg-red-50 p-4 rounded-lg"
    >

      <input
        name="name"
        placeholder="Room name"
        className="border p-2 rounded"
      />

      <select
        name="cinemaId"
        className="border p-2 rounded"
      >

        {cinemas.map((c: Cinema)=>(
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}

      </select>

      <button
        className="bg-red-600 text-white rounded px-4 py-2 hover:bg-red-700"
      >
        Create
      </button>

    </form>

  )
}