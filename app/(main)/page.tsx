import { prisma } from "@/lib/prisma"
import MovieCard from "@/components/MovieCard"
import Hero from "@/components/Hero"
import MovieCarousel from "@/components/MovieCarousel"
import Footer from "@/components/Footer"
export default async function HomePage() {
  const nowShowing = await prisma.movie.findMany({
    where: { status: "NOW_SHOWING" },
    orderBy: { releaseDate: "desc" }
  })

  const comingSoon = await prisma.movie.findMany({
    where: { status: "COMING_SOON" },
    orderBy: { releaseDate: "asc" }
  })

  return (
    <main className="bg-black text-white min-h-screen">

      <Hero />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 space-y-16">

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              <span className="text-red-600">Phim đang chiếu</span>
            </h2>

            <button className="text-sm text-gray-400 hover:text-white transition">
              Xem tất cả
            </button>
          </div>
          <MovieCarousel>
            {nowShowing.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </MovieCarousel>

        </section>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold">
              <span className="text-red-500">Phim sắp chiếu</span>
            </h2>

            <button className="text-sm text-gray-400 hover:text-white transition">
              Xem tất cả
            </button>
          </div>

          <MovieCarousel>
            {comingSoon.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </MovieCarousel>
        </section>

      </div>
        <Footer />

    </main>
  )
}