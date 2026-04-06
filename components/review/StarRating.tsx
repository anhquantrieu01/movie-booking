"use client"

import { useState } from "react"
import { Star } from "lucide-react"

export function StarRating({ value, onChange }: {
  value: number
  onChange: (v: number) => void
}) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map((star) => (
        <Star
          key={star}
          size={28}
          className={`cursor-pointer transition ${
            (hover || value) >= star
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
        />
      ))}
    </div>
  )
}