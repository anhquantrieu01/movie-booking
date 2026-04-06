import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { bookingId, success } = await req.json()

    const result = await prisma.$transaction(async (tx) => {

      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: { payment: true }
      })

      if (!booking) throw new Error("Booking not found")
      if (!booking.payment) throw new Error("Payment not found")

      // 🔥 idempotent: nếu đã xử lý rồi thì return luôn
      if (
        booking.status === "CONFIRMED" ||
        booking.status === "CANCELLED"
      ) {
        return booking
      }

      // =expire → cancel + release ghế
      if (booking.expiresAt && booking.expiresAt < new Date()) {

        await tx.bookingSeat.deleteMany({
          where: { bookingId }
        })

        await tx.payment.update({
          where: { bookingId },
          data: { status: "FAILED" }
        })

        await tx.booking.update({
          where: { id: bookingId },
          data: { status: "CANCELLED" }
        })

        throw new Error("Booking expired")
      }

      if (success) {
        await tx.payment.update({
          where: { bookingId },
          data: { status: "SUCCESS" }
        })

        await tx.booking.update({
          where: { id: bookingId },
          data: { status: "CONFIRMED" }
        })
      } else {
        // fail → giải phóng ghế
        await tx.bookingSeat.deleteMany({
          where: { bookingId }
        })

        await tx.payment.update({
          where: { bookingId },
          data: { status: "FAILED" }
        })

        await tx.booking.update({
          where: { id: bookingId },
          data: { status: "CANCELLED" }
        })
      }

      return booking
    })

    return NextResponse.json({ success: true, data: result })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}