/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import Image from "next/image"

export default function MovieReviewUI({
  avgRating,
  reviewCount,
  stats,
  reviews,
  movieId,
  onSuccess,
  loadMoreRef,
  hasMore
}: any) {

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  const total = reviewCount || 1

  const submit = async () => {
    if (!rating) return

    setLoading(true)

    await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment, movieId }),
    })

    setRating(0)
    setComment("")
    setLoading(false)

    onSuccess()
  }

  return (
    <div className="bg-[#0f0f0f] max-w-6xl mx-auto text-white p-4 md:p-6 rounded-2xl shadow-xl border border-gray-800 space-y-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div className="flex items-center gap-4">
          <div className="text-5xl font-bold text-red-500">
            {avgRating.toFixed(1)}
          </div>

          <div>
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <Star
                  key={i}
                  size={18}
                  className={
                    i <= Math.round(avgRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-600"
                  }
                />
              ))}
            </div>

            <div className="text-sm text-gray-400">
              {reviewCount} đánh giá
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Đánh giá từ người xem
        </div>
      </div>

      {/* STATS */}
      <div className="space-y-2">
        {[5,4,3,2,1].map(star => {
          const found = stats.find((s:any)=>s.star===star)
          const percent = Math.round((found?.count||0)/total*100)

          return (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span className="w-6 text-gray-300">{star}★</span>

              <div className="flex-1 h-2 bg-gray-800 rounded overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-red-500 to-red-700 transition-all duration-500"
                  style={{ width: percent+"%" }}
                />
              </div>

              <span className="w-10 text-right text-gray-400">
                {percent}%
              </span>
            </div>
          )
        })}
      </div>

      {/* INPUT */}
      <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 space-y-4">

        <div className="font-semibold text-red-400">
          Đánh giá của bạn
        </div>

        {/* STAR SELECT */}
        <div className="flex gap-1">
          {[1,2,3,4,5].map(i => (
            <Star
              key={i}
              size={28}
              onClick={() => setRating(i)}
              className={`cursor-pointer transition-all duration-200 ${
                i <= rating
                  ? "fill-yellow-400 text-yellow-400 scale-110"
                  : "text-gray-500 hover:text-yellow-300"
              }`}
            />
          ))}
        </div>

        {/* COMMENT */}
        <textarea
          value={comment}
          onChange={e=>setComment(e.target.value)}
          placeholder="Viết cảm nhận của bạn..."
          className="w-full bg-black border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-red-500"
        />

        {/* BUTTON */}
        <button
          onClick={submit}
          disabled={loading || !rating}
          className="w-full md:w-auto px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 rounded-lg transition font-medium hover:shadow-[0_0_10px_rgba(239,68,68,0.5)]"
        >
          {loading ? "Đang gửi..." : "Gửi đánh giá"}
        </button>
      </div>

      {/* REVIEW LIST */}
      <div className="space-y-4">
        {reviews.map((r:any)=>(
          <div
            key={r.id}
            className="bg-[#141414] p-4 rounded-xl border border-gray-800 hover:border-red-500/40 transition"
          >
            <div className="flex items-center gap-3 mb-2">
              <Image
                src={r.user.image || "/avatar.png"}
                className="w-8 h-8 rounded-full object-cover"
                alt={r.user.name || "User"}
                width={32}
                height={32}

              />

              <div className="text-sm font-medium">
                {r.user.name || "User"}
              </div>
            </div>

            <div className="flex mb-1">
              {[1,2,3,4,5].map(i => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i <= r.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-600"
                  }
                />
              ))}
            </div>

            <div className="text-gray-300 text-sm leading-relaxed">
              {r.comment}
            </div>
          </div>
        ))}
      </div>

      {/* LOAD MORE */}
      {hasMore && (
        <div
          ref={loadMoreRef}
          className="h-10 flex items-center justify-center text-gray-500 text-sm"
        >
          Đang tải thêm...
        </div>
      )}
    </div>
  )
}