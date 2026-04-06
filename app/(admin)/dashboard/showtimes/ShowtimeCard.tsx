"use client"

import { useState } from "react"
import EditShowtimeForm from "./EditShowtimeForm"
import DeleteShowtimeButton from "./DeleteShowtimeButton"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ShowtimeCard({ s, movies, rooms }: any) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="bg-white rounded-2xl shadow p-4 space-y-3 border border-red-100">

      <div className="text-lg font-semibold text-red-600">
        {s.movie.title}
      </div>

      <div className="text-sm text-gray-600">
        🎬 {s.room.cinema.name}
      </div>

      <div className="text-sm text-gray-600">
        🏢 Room: {s.room.name}
      </div>

      <div className="text-sm text-gray-600">
        ⏰ {new Date(s.startTime).toLocaleString()} - {new Date(s.endTime).toLocaleTimeString()}
      </div>

      <div className="text-sm font-medium text-green-600">
        💰 {s.price.toLocaleString()}đ
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded-lg"
        >
          {isEditing ? "Close" : "Edit"}
        </button>

        <DeleteShowtimeButton id={s.id} />
      </div>

      {isEditing && (
        <div className="pt-3 border-t">
          <EditShowtimeForm
            showtime={s}
            movies={movies}
            rooms={rooms}
          />
        </div>
      )}

    </div>
  )
}