import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">

     
        <div>
          <h2 className="text-2xl font-extrabold text-red-600 mb-4">
             Cinema
          </h2>
          <p className="text-sm leading-relaxed">
            Nền tảng đặt vé xem phim online nhanh chóng, tiện lợi. 
            Cập nhật phim mới nhất, lịch chiếu liên tục.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-white font-semibold mb-4">Khám phá</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-red-500 transition">Trang chủ</Link>
            </li>
            <li>
              <Link href="/" className="hover:text-red-500 transition">Phim</Link>
            </li>
            <li>
              <Link href="/" className="hover:text-red-500 transition">Lịch chiếu</Link>
            </li>
            <li>
              <Link href="/" className="hover:text-red-500 transition">Tin tức</Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-4">Hỗ trợ</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-red-500 transition">Liên hệ</Link>
            </li>
            <li>
              <Link href="/" className="hover:text-red-500 transition">Chính sách</Link>
            </li>
            <li>
              <Link href="/" className="hover:text-red-500 transition">Điều khoản</Link>
            </li>
            <li>
              <Link href="/" className="hover:text-red-500 transition">FAQ</Link>
            </li>
          </ul>
        </div>

        {/* Contact + Social */}
        <div>
          <h3 className="text-white font-semibold mb-4">Kết nối</h3>

          <p className="text-sm mb-3">
            📧 support@cinema.com
          </p>

          <div className="flex gap-4">
            <Link href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-600 transition">
              <span>f</span>
            </Link>
            <Link href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-600 transition">
              <span>t</span>
            </Link>
            <Link href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-600 transition">
              <span>in</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Divider đẹp */}
      <div className="h-px bg-gradient-to-r from-transparent via-red-600 to-transparent" />

      {/* Bottom */}
      <div className="py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Cinema. All rights reserved.
      </div>
    </footer>
  )
}