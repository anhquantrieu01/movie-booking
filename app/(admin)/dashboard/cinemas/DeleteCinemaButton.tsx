"use client"

import { deleteCinema } from "./actions"

export default function DeleteCinemaButton({ id }: { id: string }) {

  async function handleDelete() {

    if (!confirm("Delete this cinema?")) return

    await deleteCinema(id)
  }

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 text-white px-3 py-1 rounded"
    >
      Delete
    </button>
  )
}