/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useMemo } from "react"
import { updateShowtime } from "./actions"

export default function EditShowtimeForm({
  showtime,
  movies,
  rooms
}: any) {
  const [movieId, setMovieId] = useState(showtime.movieId)
  const [roomId, setRoomId] = useState(showtime.roomId)
  const [startTime, setStartTime] = useState(
    new Date(showtime.startTime).toISOString().slice(0, 16)
  )
  const [price, setPrice] = useState(showtime.price)

  // 🔥 movie hiện tại
  const selectedMovie = useMemo(() => {
    return movies.find((m: any) => m.id === movieId)
  }, [movieId, movies])

  // 🔥 tính endTime
  const endTime = useMemo(() => {
    if (!startTime || !selectedMovie) return null
    const BUFFER_MINUTES = 10
    const start = new Date(startTime)
    const end = new Date(start.getTime() + (selectedMovie.duration + BUFFER_MINUTES) * 60000)

    return end
  }, [startTime, selectedMovie])

  return (
    <form
      action={(formData) => updateShowtime(showtime.id, formData)}
      className="grid md:grid-cols-4 gap-4 bg-yellow-50 p-4 rounded-lg"
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
      <select
        name="roomId"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="p-2 border rounded"
      >
        {rooms.map((r: any) => (
          <option key={r.id} value={r.id}>
            {r.cinema.name} - {r.name}
          </option>
        ))}
      </select>

      {/* Start Time */}
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
        required
        min={0}
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="p-2 border rounded"
      />

      {/* 🔥 Preview */}
      <div className="col-span-full text-sm text-gray-700">
        {endTime ? (
          <span>
            ⏱ Kết thúc dự kiến:{" "}
            <b>{endTime.toLocaleString()}</b>
          </span>
        ) : (
          <span>Chọn thời gian để xem giờ kết thúc</span>
        )}
      </div>

      {/* Submit */}
      <button
        className="col-span-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
      >
        Update Showtime
      </button>
    </form>
  )
}