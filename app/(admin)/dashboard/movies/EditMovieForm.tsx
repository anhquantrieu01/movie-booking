"use client"

import { useState } from "react"
import { updateMovie } from "./actions"
import { Movie } from "@/generated/prisma/client"

export default function EditMovieForm({ movie }: { movie: Movie }) {

  const [open, setOpen] = useState(false)

  if (!open)
    return (
      <button
        onClick={() => setOpen(true)}
        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
      >
        Edit
      </button>
    )

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

      <form
        action={updateMovie}
        className="bg-white w-full max-w-2xl rounded-lg p-6 grid md:grid-cols-2 gap-4"
      >

        <h2 className="text-xl font-bold text-red-600 md:col-span-2">
          Edit Movie
        </h2>

        <input type="hidden" name="id" value={movie.id} />

        {/* title */}
        <input
          name="title"
          defaultValue={movie.title}
          placeholder="Title"
          className="border p-2 rounded"
        />

        {/* duration */}
        <input
          name="duration"
          type="number"
          defaultValue={movie.duration}
          placeholder="Duration"
          className="border p-2 rounded"
        />

        {/* description */}
        <textarea
          name="description"
          defaultValue={movie.description || ""}
          placeholder="Description"
          className="border p-2 rounded md:col-span-2"
        />

        {/* release date */}
        <input
          name="releaseDate"
          type="date"
          defaultValue={
            movie.releaseDate
              ? new Date(movie.releaseDate).toISOString().split("T")[0]
              : ""
          }
          className="border p-2 rounded"
        />

        {/* status */}
        <select
          name="status"
          defaultValue={movie.status}
          className="border p-2 rounded"
        >
          <option value="COMING_SOON">Coming Soon</option>
          <option value="NOW_SHOWING">Now Showing</option>
          <option value="ENDED">Ended</option>
        </select>

        {/* language */}
        <input
          name="language"
          defaultValue={movie.language || ""}
          placeholder="Language"
          className="border p-2 rounded"
        />

        {/* country */}
        <input
          name="country"
          defaultValue={movie.country || ""}
          placeholder="Country"
          className="border p-2 rounded"
        />

        <input
          name="trailerUrl"
          defaultValue={movie.trailerUrl || ""}
          placeholder="Trailer"
          className="border p-2 rounded"
        />

        {/* age rating */}
        <select
          name="ageRating"
          defaultValue={movie.ageRating || ""}
          className="border p-2 rounded"
        >
          <option value="">Age Rating</option>
          <option value="G">G</option>
          <option value="PG">PG</option>
          <option value="PG13">PG13</option>
          <option value="R">R</option>
          <option value="C13">C13</option>
          <option value="C16">C16</option>
          <option value="C18">C18</option>
        </select>

        {/* poster */}
        <input
          type="file"
          name="poster"
          accept="image/*"
          className="border p-2 rounded md:col-span-2"
        />

        {/* buttons */}
        <div className="flex gap-3 md:col-span-2 justify-end">

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Save
          </button>

        </div>

      </form>

    </div>
  )
}