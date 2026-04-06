"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Film, Calendar, Users, CreditCard, Building2 } from "lucide-react";

const menu = [
  {
    label: "Movies",
    href: "/dashboard/movies",
    icon: Film,
  },
  {
    label: "Cinemas",
    href: "/dashboard/cinemas",
    icon: Building2,
  },
  {
    label: "Rooms",
    href: "/dashboard/rooms",
    icon: Building2,
  },
  {
    label: "Seat Zones",
    href: "/dashboard/seat-zones",
    icon: Building2,
  },
  {
    label: "Showtimes",
    href: "/dashboard/showtimes",
    icon: Calendar,
  },
  {
    label: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    label: "Payments",
    href: "/dashboard/payments",
    icon: CreditCard,
  },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-red-600 text-white p-2 rounded"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>

      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-red-600 text-white transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-6 text-2xl font-bold border-b border-red-500">
          Admin Panel
        </div>

        <nav className="p-4 space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
                ${active ? "bg-red-500" : "hover:bg-red-500"}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}