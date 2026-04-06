"use client"

import { useState } from "react"
import EditShowtimeForm from "./EditShowtimeForm"
import DeleteShowtimeButton from "./DeleteShowtimeButton"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ShowtimeRow({ s, movies, rooms }: any) {
    const [isEditing, setIsEditing] = useState(false)

    return (
        <>
            <tr className="border-t hover:bg-red-50">
                <td className="p-3">{s.movie.title}</td>

                <td className="p-3">{s.room.cinema.name}</td>

                <td className="p-3">{s.room.name}</td>

                <td className="p-3">
                    {new Date(s.startTime).toLocaleString()} -{" "}
                    {new Date(s.endTime).toLocaleTimeString()}
                </td>

                <td className="p-3">
                    {s.price.toLocaleString()}đ
                </td>

                <td className="p-3 flex gap-2 justify-center">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                        {isEditing ? "Close" : "Edit"}
                    </button>

                    <DeleteShowtimeButton id={s.id} />
                </td>
            </tr>

            {/* 🔥 Expand form */}
            {isEditing && (
                <tr className="bg-yellow-50">
                    <td colSpan={6} className="p-4">
                        <EditShowtimeForm
                            showtime={s}
                            movies={movies}
                            rooms={rooms}
                        />
                    </td>
                </tr>
            )}
        </>
    )
}