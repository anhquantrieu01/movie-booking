import { prisma } from "@/lib/prisma"
import CreateShowtimeForm from "./CreateShowtimeForm"
import ShowtimeRow from "./ShowtimeRow"
import ShowtimeCard from "./ShowtimeCard"

export default async function Page() {

  const showtimes = await prisma.showtime.findMany({
    include: {
      movie: true,
      room: {
        include: {
          cinema: true
        }
      }
    },
    orderBy: { startTime: "desc" }
  })

  const movies = await prisma.movie.findMany()
  const rooms = await prisma.room.findMany({
    include: { cinema: true }
  })

  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-red-600">
          Showtime Management
        </h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
        <CreateShowtimeForm movies={movies} rooms={rooms} />
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto rounded-2xl shadow border border-red-200">
        <table className="w-full">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="p-3 text-left">Movie</th>
              <th className="p-3 text-left">Cinema</th>
              <th className="p-3 text-left">Room</th>
              <th className="p-3 text-left">Start Time</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {showtimes.map((s) => (
              <ShowtimeRow
                key={s.id}
                s={s}
                movies={movies}
                rooms={rooms}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card */}
      <div className="lg:hidden space-y-4">
        {showtimes.map((s) => (
          <ShowtimeCard
            key={s.id}
            s={s}
            movies={movies}
            rooms={rooms}
          />
        ))}
      </div>

    </div>
  )
}
