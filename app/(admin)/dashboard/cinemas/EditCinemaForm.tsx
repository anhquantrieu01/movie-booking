"use client"

import { useState } from "react"
import { updateCinema } from "./actions"
import { Cinema } from "@/generated/prisma/browser"

export default function EditCinemaForm({ cinema }: { cinema: Cinema }) {
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
      >
        Edit
      </button>
    )
  }

  return (
    <form
      action={(formData) => updateCinema(cinema.id, formData)}
      className="grid gap-2 sm:grid-cols-3 items-center"
    >
      <input
        name="name"
        defaultValue={cinema.name}
        className="border rounded-lg p-2 w-full"
        placeholder="Cinema name"
      />

      <input
        name="address"
        defaultValue={cinema.address}
        className="border rounded-lg p-2 w-full"
        placeholder="Address"
      />

      <button
        className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
      >
        Save
      </button>
    </form>
  )
}