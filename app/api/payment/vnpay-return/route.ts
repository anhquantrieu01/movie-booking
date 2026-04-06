import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = Object.fromEntries(url.searchParams.entries());
  const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/my-tickets`;

  const bookingId = params["vnp_TxnRef"];
  const responseCode = params["vnp_ResponseCode"];

  if (responseCode === "00") {
    // ✅ thanh toán thành công
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { bookingId },
        data: { status: "SUCCESS" },
      });

      await tx.booking.update({
        where: { id: bookingId },
        data: { status: "CONFIRMED" },
      });
    });

    return NextResponse.redirect(returnUrl);
  } else {
    // ❌ thất bại
    await prisma.payment.update({
      where: { bookingId },
      data: { status: "FAILED" },
    });

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });

    return NextResponse.redirect(returnUrl);
  }
}
