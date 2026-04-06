import Link from "next/link"
import Image from "next/image"
import { Movie } from "@/generated/prisma/client"

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link href={`/movie/${movie.slug}`}>
      <div className="group cursor-pointer">

        {/* Poster */}
        <div className="relative aspect-2/3 overflow-hidden rounded-xl">

          <Image
            src={movie.posterUrl || "/placeholder.png"}
            alt={movie.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-110"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-80" />

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg">
              🎟 Đặt vé
            </button>
          </div>

          {/* Bottom info overlay */}
          <div className="absolute bottom-0 p-3 w-full">
            <h3 className="text-white font-semibold line-clamp-1">
              {movie.title}
            </h3>
            <p className="text-xs text-gray-300">
              ⏱ {movie.duration} phút
            </p>
          </div>

        </div>

      </div>
    </Link>
  )
}