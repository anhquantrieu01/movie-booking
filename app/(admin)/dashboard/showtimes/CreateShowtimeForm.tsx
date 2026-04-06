/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useMemo } from "react"
import { createShowtime } from "./actions"

export default function CreateShowtimeForm({ movies, rooms }: any) {
  const [movieId, setMovieId] = useState(movies[0]?.id)
  const [startTime, setStartTime] = useState("")
  const [price, setPrice] = useState("")

  // 🔥 tìm movie hiện tại
  const selectedMovie = useMemo(() => {
    return movies.find((m: any) => m.id === movieId)
  }, [movieId, movies])

  // 🔥 tính endTime realtime
const endTime = useMemo(() => {
  if (!startTime || !selectedMovie) return null
  const BUFFER_MINUTES = 10
  const start = new Date(startTime)
  const end = new Date(start.getTime() + (selectedMovie.duration + BUFFER_MINUTES) * 60000)

  return end // ✅ trả về Date luôn
}, [startTime, selectedMovie])

  return (
    <form
      action={createShowtime}
      className="grid md:grid-cols-4 gap-4 bg-red-50 p-4 rounded-lg"
    >
      {/* Movie */}
      <select
        name="movieId"
        value={movieId}
        onChange={(e) => setMovieId(e.target.value)}
        className="p-2 border rounded"
      >
        {movies.map((m: any) => (
          <option key={m.id} value={m.id}>
            {m.title} ({m.duration} phút)
          </option>
        ))}
      </select>

      {/* Room */}
      <select name="roomId" className="p-2 border rounded">
        {rooms.map((r: any) => (
          <option key={r.id} value={r.id}>
            {r.cinema.name} - {r.name}
          </option>
        ))}
      </select>

      {/* Start time */}
      <input
        type="datetime-local"
        name="startTime"
        required
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        className="p-2 border rounded"
      />

      {/* Price */}
      <input
        type="number"
        name="price"
        placeholder="Price"
        required
        min={0}
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="p-2 border rounded"
      />

      {/* 🔥 Preview endTime */}
      <div className="col-span-full text-sm text-gray-700">
  {endTime ? (
    <span>
      ⏱ Kết thúc dự kiến:{" "}
      <b>
        {endTime.toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        })}
      </b>
    </span>
  ) : (
    <span>Chọn thời gian để xem giờ kết thúc</span>
  )}
</div>

      {/* Submit */}
      <button
        className="col-span-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
      >
        Create Showtime
      </button>
    </form>
  )
}