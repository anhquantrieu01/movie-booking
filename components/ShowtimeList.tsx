/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import Link from "next/link"
import dayjs from "dayjs"
import { useState } from "react"

export default function ShowtimeList({ groupedShowtimes }: any) {

  const dates = Object.keys(groupedShowtimes)

  // 👉 nếu không có dữ liệu luôn
  if (dates.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-xl font-semibold mb-2">
          Hiện chưa có lịch chiếu
        </p>
        <p className="text-sm">
          Vui lòng quay lại sau hoặc chọn phim khác
        </p>
      </div>
    )
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedDate, setSelectedDate] = useState(dates[0])

  const data = groupedShowtimes[selectedDate] || {}

  return (
    <div className="space-y-6">

      {/* ================= DATE TABS ================= */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {dates.map((date) => (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className={`
              px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap
              transition
              ${selectedDate === date
                ? "bg-red-600 text-white"
                : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"}
            `}
          >
            {dayjs(date).format("DD/MM")}
          </button>
        ))}
      </div>

      {/* ================= EMPTY DATE ================= */}
      {Object.keys(data).length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <p className="text-lg">
            😢 Không có suất chiếu trong ngày này
          </p>
        </div>
      ) : (
        <div className="space-y-8">

          {Object.entries(data).map(([cinema, rooms]: any) => (
            <div key={cinema} className="space-y-4">

              <h3 className="text-lg font-bold text-red-500">
                📍 {cinema}
              </h3>

              {Object.entries(rooms).map(([room, times]: any) => (
                <div
                  key={room}
                  className="bg-black/40 border border-white/10 rounded-xl p-4"
                >
                  <p className="text-sm text-gray-400 mb-3">
                    {room}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {times.map((s: any) => (
                      <Link
                        key={s.id}
                        href={`/booking/${s.id}`}
                        className="
                          px-4 py-2 rounded-lg
                          bg-zinc-800 hover:bg-red-600
                          border border-white/10
                          text-sm font-semibold
                          transition duration-200
                        "
                      >
                        {dayjs(s.startTime).format("HH:mm")}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

            </div>
          ))}

        </div>
      )}

    </div>
  )
}