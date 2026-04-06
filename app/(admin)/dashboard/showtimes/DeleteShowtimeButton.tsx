"use client"

import { deleteShowtime } from "./actions"

export default function DeleteShowtimeButton({ id }: { id: string }) {

  return (

    <form action={deleteShowtime.bind(null, id)}>

      <button
        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
      >
        Delete
      </button>

    </form>

  )
}