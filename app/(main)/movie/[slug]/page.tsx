import { prisma } from "@/lib/prisma"
import ShowtimeList from "@/components/ShowtimeList"
import { notFound } from "next/navigation"
import dayjs from "dayjs"
import MovieReviewWrapper from "@/components/review/ReviewWrapper"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Metadata } from "next"


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  const movie = await prisma.movie.findUnique({
    where: { slug },
  })

  if (!movie) {
    return {
      title: "Phim không tồn tại",
    }
  }

  return {
    title: movie.title,
    description: movie.description?.slice(0, 160),

    openGraph: {
      title: movie.title,
      description: movie.description ? movie.description.slice(0, 160) : undefined,
      images: [movie.posterUrl || ""],
      type: "video.movie",
    },

    twitter: {
      card: "summary_large_image",
      title: movie.title,
      description: movie.description,
      images: [movie.posterUrl || ""],
    },
  }
}


export default async function MovieDetail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const movie = await prisma.movie.findUnique({
    where: { slug },
    include: {
      reviews: true
    }
  })

  if (!movie) return notFound()

  const now = new Date()
  const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const showtimes = await prisma.showtime.findMany({
    where: {
      movieId: movie.id,
      startTime: {
        gte: now,
        lte: next7Days,
      },
    },
    include: {
      room: {
        include: {
          cinema: true,
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const grouped: any = {}

  showtimes.forEach((st) => {
    const date = dayjs(st.startTime).format("YYYY-MM-DD")
    const cinema = st.room.cinema.name
    const room = st.room.name

    if (!grouped[date]) grouped[date] = {}
    if (!grouped[date][cinema]) grouped[date][cinema] = {}
    if (!grouped[date][cinema][room]) grouped[date][cinema][room] = []

    grouped[date][cinema][room].push(st)
  })

  return (
    <main className="bg-black text-white min-h-screen">

      {/* 🔥 HERO */}
      <div className="relative h-[60vh] w-full">
        <Image
          src={movie.posterUrl || ""}
          alt={movie.title}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex items-end pb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              {movie.title}
            </h1>

            <p className="text-gray-300">
              ⏱ {movie.duration} phút
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 space-y-12">

        <div className="grid md:grid-cols-3 gap-8">

          {/* POSTER */}
          <div className="relative group aspect-2/3">
            <Image
              src={movie.posterUrl || ""}
              alt={movie.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="rounded-xl shadow-lg object-cover
              transform group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 rounded-xl bg-red-600/10 opacity-0 group-hover:opacity-100 transition" />
          </div>

          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              Nội dung phim
            </h2>

            <p className="text-gray-300 leading-relaxed">
              {movie.description}
            </p>

            <div className="flex gap-4 flex-wrap">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition">
                    ▶ Xem Trailer
                  </button>
                </DialogTrigger>

                <DialogContent className="w-full max-w-5xl p-0 bg-black border border-white/10">
                  <div className="aspect-video w-full">
                    <iframe
                      src={movie.trailerUrl}
                      title="Trailer"
                      className="w-full h-full rounded-lg"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  </div>
                </DialogContent>
              </Dialog>

              <button className="border border-white/20 hover:bg-white/10 px-6 py-3 rounded-lg transition">
                ❤️ Yêu thích
              </button>
            </div>
          </div>

        </div>

        <div className="h-px bg-linear-to-r from-transparent via-red-600 to-transparent" />

        {/* SHOWTIME */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            🎟 <span className="text-red-600">Lịch chiếu</span>
          </h2>

          <div className="bg-zinc-900 p-6 rounded-xl shadow-lg">
            <ShowtimeList groupedShowtimes={grouped} />
          </div>
        </section>

      </div>

      <MovieReviewWrapper movieId={movie.id} />
    </main>
  )
}