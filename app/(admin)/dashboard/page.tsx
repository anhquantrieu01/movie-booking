import { prisma } from "@/lib/prisma"
import StatsCard from "@/components/admin/StatsCard"

export default async function DashboardPage() {

  const movies = await prisma.movie.count()
  const users = await prisma.user.count()
  const bookings = await prisma.booking.count()
  const cinemas = await prisma.cinema.count()

  return (
    <div className="grid gap-6 md:grid-cols-3">

      <StatsCard
        title="Movies"
        value={movies}
      />

      <StatsCard
        title="Users"
        value={users}
      />

      <StatsCard
        title="Bookings"
        value={bookings}
      />

      <StatsCard
        title="Cinemas"
        value={cinemas}
      />

    </div>
  )
}