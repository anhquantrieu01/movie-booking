"use client"

import { useState, useRef, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { signIn, signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any
}

export default function HeaderClient({ session }: Props) {
  const [open, setOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)

  const menuRef = useRef<HTMLDivElement | null>(null)
  const user = session?.user

  // ✅ Click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // ✅ ESC close
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setUserMenu(false)
      }
    }

    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [])

  return (
    <header className="bg-black text-white sticky top-0 z-50 shadow-md border-b border-gray-800">

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="text-2xl font-extrabold text-red-600">
            🎬 Cinema
          </Link>


          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-red-500">Trang chủ</Link>
            <Link href="/" className="hover:text-red-500">Phim</Link>
            <Link href="/" className="hover:text-red-500">Lịch chiếu</Link>
          </nav>




          <div className="hidden md:flex items-center gap-4 relative">

            {!user ? (
              <button
                onClick={() => signIn("google")}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Đăng nhập
              </button>
            ) : (
              <div ref={menuRef} className="relative">

                {/* Avatar */}
                <button onClick={() => setUserMenu(!userMenu)}>
                  <Image
                    src={user.image || "/avatar.png"}
                    alt="avatar"
                    width={32}
                    height={32}
                    className="rounded-full cursor-pointer"
                  />
                </button>

                {/* Dropdown */}
                {userMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-lg shadow-lg p-2 space-y-1">

                    <p className="px-2 py-1 text-sm text-gray-300">
                      {user.name}
                    </p>

                    <div className="h-px bg-white/10" />



                    <Link
                      href="/my-tickets"
                      onClick={() => setUserMenu(false)}
                      className="block px-2 py-1 hover:bg-white/10 rounded text-sm"
                    >
                      Vé của tôi
                    </Link>
                    {user.role === "ADMIN" ? (
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenu(false)}
                        className="block px-2 py-1 hover:bg-white/10 rounded text-sm"
                      >
                        Dashboard
                      </Link>
                    ) : (
                      <Link
                        href="/dashboard/showtimes"
                        onClick={() => setUserMenu(false)}
                        className="block px-2 py-1 hover:bg-white/10 rounded text-sm"
                      >
                        Tạo suất chiếu
                      </Link>
                    )}


                    <div className="h-px bg-white/10" />

                    <button
                      onClick={() => {
                        setUserMenu(false)
                        signOut()
                      }}
                      className="w-full text-left px-2 py-1 hover:bg-red-600 rounded text-sm"
                    >
                      Đăng xuất
                    </button>

                  </div>
                )}
              </div>
            )}

          </div>

          {/* Mobile Button */}
          <button onClick={() => setOpen(true)} className="md:hidden">
            <Menu />
          </button>
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-black z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <span className="text-red-600 font-bold">Menu</span>
          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        <nav className="flex flex-col gap-4 p-4">
          <Link href="/" className="hover:text-red-500" onClick={() => setOpen(false)}>Trang chủ</Link>
          <Link href="/" className="hover:text-red-500" onClick={() => setOpen(false)}>Phim</Link>
          <Link href="/" className="hover:text-red-500" onClick={() => setOpen(false)}>Lịch chiếu</Link>
        </nav>

        <div className="p-4 border-t border-gray-700">
          {!user ? (
            <button
              onClick={() => signIn("google")}
              className="w-full bg-red-600 py-2 rounded"
            >
              Đăng nhập
            </button>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                <Image
                  src={user.image || "/avatar.png"}
                  alt="avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span>{user.name}</span>
              </div>



              <Link
                href="/my-tickets"
                onClick={() => setOpen(false)}
                className="block mb-2 bg-white/10 py-2 rounded text-center"
              >
                Vé của tôi
              </Link>

              {user.role === "ADMIN" ? (
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="block px-2 py-1 hover:bg-white/10 rounded text-sm"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/dashboard/showtimes"
                  onClick={() => setOpen(false)}
                  className="block px-2 py-1 hover:bg-white/10 rounded text-sm"
                >
                  Tạo suất chiếu
                </Link>
              )}


              <button
                onClick={() => signOut()}
                className="w-full bg-red-600 py-2 rounded"
              >
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}