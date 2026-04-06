/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import crypto from "crypto";
import qs from "qs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { bookingId, amount } = body;

    if (!bookingId || !amount) {
      return NextResponse.json(
        { error: "Thiếu bookingId hoặc amount" },
        { status: 400 },
      );
    }

    const tmnCode = process.env.VNP_TMN_CODE;
    const secretKey = process.env.VNP_HASH_SECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/vnpay-return`;

    if (!tmnCode || !secretKey || !vnpUrl || !returnUrl) {
      throw new Error("Thiếu ENV VNPAY");
    }

    const date = new Date();
    const createDate = formatDate(date);

    const ipAddr =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

    // eslint-disable-next-line prefer-const
    let vnpParams: any = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Amount: amount * 100,
      vnp_CurrCode: "VND",
      vnp_TxnRef: bookingId,
      vnp_OrderInfo: `Thanh toan booking ${bookingId}`,
      vnp_OrderType: "other",
      vnp_Locale: "vn",
      vnp_ReturnUrl: returnUrl,
      vnp_CreateDate: createDate,
      vnp_IpAddr: ipAddr,
    };

    const sortedParams = sortObject(vnpParams);

    const signData = qs.stringify(sortedParams, { encode: false });

    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(signData).digest("hex");

    const paymentUrl =
      vnpUrl +
      "?" +
      qs.stringify(
        { ...sortedParams, vnp_SecureHash: signed },
        { encode: false },
      );

    return NextResponse.json({
      paymentUrl,
    });
  } catch (error: any) {
    console.error("💥 VNPAY ERROR:", error);

    return NextResponse.json(
      {
        error: "Lỗi tạo URL VNPAY",
        message: error.message,
        stack: error.stack,
      },
      { status: 500 },
    );
  }
}

// helper
function sortObject(obj: any) {
  return Object.keys(obj)
    .sort()
    .reduce((acc: any, key) => {
      acc[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
      return acc;
    }, {});
}

function formatDate(date: Date) {
  return date
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
}
