import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { showtimeId, seatIds, paymentMethod } = await req.json()

    const session = await auth()
    const userId = session?.user?.id

    if (!userId || !showtimeId || !seatIds?.length) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 })
    }

    const result = await prisma.$transaction(async (tx) => {

      // clear booking hết hạn + xóa seat
      const expiredBookings = await tx.booking.findMany({
        where: {
          status: "PENDING",
          expiresAt: { lt: new Date() }
        },
        select: { id: true }
      })

      if (expiredBookings.length > 0) {
        const ids = expiredBookings.map(b => b.id)

        await tx.bookingSeat.deleteMany({
          where: { bookingId: { in: ids } }
        })

        await tx.booking.updateMany({
          where: { id: { in: ids } },
          data: { status: "CANCELLED" }
        })
      }

      // check ghế đã bị giữ chưa
      const existingSeats = await tx.bookingSeat.findMany({
        where: {
          showtimeId,
          seatId: { in: seatIds }
        }
      })

      if (existingSeats.length > 0) {
        throw {
          type: "SEAT_CONFLICT",
          bookedSeatIds: existingSeats.map(s => s.seatId)
        }
      }

      const showtime = await tx.showtime.findUnique({
        where: { id: showtimeId },
        select: { price: true }
      })

      if (!showtime) throw new Error("Showtime not found")

      const expireTime = new Date(Date.now() + 10 * 60 * 1000)

      //create booking
      const booking = await tx.booking.create({
        data: {
          userId,
          showtimeId,
          status: "PENDING",
          expiresAt: expireTime
        }
      })

      // insert từng seat (atomic hơn)
      for (const seatId of seatIds) {
        await tx.bookingSeat.create({
          data: {
            bookingId: booking.id,
            seatId,
            showtimeId
          }
        })
      }

      // 5. payment
      const payment = await tx.payment.create({
        data: {
          bookingId: booking.id,
          amount: seatIds.length * showtime.price,
          method: paymentMethod || "CASH",
          status: "PENDING"
        }
      })

      return { booking, payment }
    })

    return NextResponse.json({ success: true, ...result })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {

    // 🔥 bắt lỗi unique constraint (quan trọng nhất)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Ghế vừa bị người khác đặt" },
        { status: 409 }
      )
    }

    if (error.type === "SEAT_CONFLICT") {
      return NextResponse.json(error, { status: 409 })
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}