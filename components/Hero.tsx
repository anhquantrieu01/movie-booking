"use client"

import Link from "next/link"
import Image from "next/image"

export default function Hero() {
  return (
    <section className="relative w-full h-[90vh] overflow-hidden bg-black text-white">
      
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1524985069026-dd778a71c7b4"
          alt="cinema"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full max-w-6xl mx-auto px-6">
        
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Đặt vé phim <span className="text-red-600">nhanh chóng</span> <br />
          Trải nghiệm <span className="text-red-500">đỉnh cao điện ảnh</span>
        </h1>

        <p className="mt-4 text-gray-300 max-w-xl text-lg">
          Xem lịch chiếu, chọn ghế và đặt vé chỉ trong vài giây. 
          Không xếp hàng – Không chờ đợi.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/"
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            Xem phim đang chiếu
          </Link>

          <Link
            href="/"
            className="border border-white/30 hover:bg-white/10 px-6 py-3 rounded-lg transition"
          >
            Xem lịch chiếu
          </Link>
        </div>

      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 w-full h-32 bg-linear-to-t from-black to-transparent" />
    </section>
  )
}