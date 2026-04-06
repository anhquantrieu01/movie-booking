import Sidebar from "@/components/admin/Sidebar"
import Header from "@/components/admin/Header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-red-50">

      <Sidebar />

      <div className="flex-1 md:ml-64">
        <Header />

        <main className="p-6">
          {children}
        </main>
      </div>

    </div>
  )
}