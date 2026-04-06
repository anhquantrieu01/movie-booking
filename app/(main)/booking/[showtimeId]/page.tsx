import SeatMap from "@/components/SeatMap"
import { prisma } from "@/lib/prisma"
import dayjs from "dayjs"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic" // 🔥 QUAN TRỌNG

export default async function Page({
  params,
}: {
  params: Promise<{ showtimeId: string }>
}) {
  const { showtimeId } = await params
  await prisma.booking.updateMany({
    where: {
      status: "PENDING",
      expiresAt: {
        lt: new Date()
      }
    },
    data: {
      status: "CANCELLED"
    }
  })
  const showtime = await prisma.showtime.findUnique({
    where: { id: showtimeId },
    include: {
      movie: true,
      room: {
        include: {
          seats: {
            orderBy: [
              { row: "asc" },
              { number: "asc" }
            ]
          },
          seatZones: true
        }
      },
      bookingSeats: {
        where: {
          booking: {
            OR: [
              {
                status: "CONFIRMED"
              },
              {
                status: "PENDING",
                expiresAt: {
                  gt: new Date() // 🔥 chưa hết hạn
                }
              }
            ]
          }
        },
        select: {
          seatId: true
        }
      }
    }
  })

  if (!showtime) return notFound()

  const bookedSeatIds = showtime.bookingSeats.map(
    s => s.seatId
  )

  return (
    <div className="relative min-h-screen text-white">

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${showtime.movie.posterUrl})`,
        }}
      />

      {/* Overlay tối */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6">

        <h1 className="text-3xl font-extrabold mb-2">
          {showtime.movie.title}
        </h1>

        <p className="text-gray-300 mb-4 text-sm sm:text-base">
          {dayjs(showtime.startTime).format("HH:mm • DD/MM/YYYY")}
        </p>

        <div className="flex gap-6">
          <SeatMap
            showtime={showtime}
            bookedSeatIds={bookedSeatIds}
          />
        </div>

      </div>
    </div>
  )
}