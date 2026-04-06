import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ showtimeId: string }>;
  },
) {
  const { showtimeId } = await params;

  const seats = await prisma.bookingSeat.findMany({
    where: {
      showtimeId,
      booking: {
        OR: [
          { status: "CONFIRMED" },
          {
            status: "PENDING",
            expiresAt: { gt: new Date() },
          },
        ],
      },
    },
    select: { seatId: true },
  });

  return NextResponse.json({
    bookedSeatIds: seats.map((s) => s.seatId),
  });
}
