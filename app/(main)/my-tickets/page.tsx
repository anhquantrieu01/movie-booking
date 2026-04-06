import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Image from "next/image"

export default async function MyTicketsPage() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) return null

  const bookings = await prisma.booking.findMany({
    where: {
      userId: user.id,
      status: "CONFIRMED",
      payment: {
    status: "SUCCESS"
  }
    },
    include: {
      showtime: {
        include: {
          movie: true,
          room: {
            include: {
              cinema: true,
            },
          },
        },
      },
      bookingSeats: {
        include: {
          seat: true,
        },
      },
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-red-500 mb-6">
        🎟 Vé đã mua
      </h1>

      {bookings.length === 0 && (
        <p className="text-gray-400">Bạn chưa có vé nào</p>
      )}

      <div className="space-y-6">
        {bookings.map((booking) => {
          const seats = booking.bookingSeats.map(
            (bs) => `${bs.seat.row}${bs.seat.number}`
          )

          return (
            <div
              key={booking.id}
              className="bg-zinc-900 rounded-2xl shadow-lg border border-red-500/20 overflow-hidden hover:scale-[1.01] transition"
            >
              <div className="flex flex-col md:flex-row">
                {/* Poster */}
                <div className="md:w-1/4">
                  <Image
                    src={booking.showtime.movie.posterUrl || ""}
                    alt=""
                    className="w-full h-full object-cover"
                    width={300}
                    height={450}
                  />
                </div>

                {/* Info */}
                <div className="p-5 flex-1">
                  <h2 className="text-xl font-bold text-red-400">
                    {booking.showtime.movie.title}
                  </h2>

                  <div className="mt-3 space-y-1 text-sm text-gray-300">
                    <p>Mã: {booking.id}</p>
                    <p>
                      🏢 {booking.showtime.room.cinema.name}
                    </p>
                    <p>
                      🎬 Phòng: {booking.showtime.room.name}
                    </p>
                    <p>
                      ⏰{" "}
                      {new Date(
                        booking.showtime.startTime
                      ).toLocaleString("vi-VN")}
                    </p>
                    <p>
                      💺 Ghế:{" "}
                      <span className="text-red-400 font-semibold">
                        {seats.join(", ")}
                      </span>
                    </p>
                  </div>

                  {/* Payment */}
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">
                        Thanh toán
                      </p>
                      <p className="text-red-400 font-semibold">
                        {booking.payment?.amount.toLocaleString()} đ
                      </p>
                    </div>

                    <span className="px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                      {booking.payment?.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}