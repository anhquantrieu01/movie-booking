"use client"

import { createMovie } from "./actions"

export default function CreateMovieForm() {

  return (

    <form
      action={createMovie}
      className="grid md:grid-cols-2 gap-4 bg-red-50 p-6 rounded-lg"
    >

      <input
        name="title"
        placeholder="Movie title"
        className="border p-2 rounded"
      />

      <input
        name="duration"
        type="number"
        placeholder="Duration (minutes)"
        className="border p-2 rounded"
      />

      <textarea
        name="description"
        placeholder="Description"
        className="border p-2 rounded md:col-span-2"
      />

      <input
        name="releaseDate"
        type="date"
        className="border p-2 rounded"
      />

      <select name="status" className="border p-2 rounded">

        <option value="COMING_SOON">
          Coming Soon
        </option>

        <option value="NOW_SHOWING">
          Now Showing
        </option>

        <option value="ENDED">
          Ended
        </option>

      </select>

      <input
        name="language"
        placeholder="Language"
        className="border p-2 rounded"
      />

      <input
        name="country"
        placeholder="Country"
        className="border p-2 rounded"
      />
      <input
        name="trailerUrl"
        placeholder="Trailer url"
        className="border p-2 rounded"
      />

      <select
        name="ageRating"
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

      <input
        name="poster"
        type="file"
        accept="image/*"
        className="border p-2 rounded"
      />

      <button
        className="bg-red-600 text-white py-2 rounded md:col-span-2 hover:bg-red-700"
      >
        Create Movie
      </button>

    </form>

  )
}