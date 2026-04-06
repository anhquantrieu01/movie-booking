import { prisma } from "@/lib/prisma"
import CreateCinemaForm from "./CreateCinemaForm"
import EditCinemaForm from "./EditCinemaForm"
import DeleteCinemaButton from "./DeleteCinemaButton"

export default async function CinemasPage() {

  const cinemas = await prisma.cinema.findMany({
    orderBy: { name: "asc" }
  })

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold text-red-600">
        Cinemas
      </h1>

      <CreateCinemaForm />

      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="border-b">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Address</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>

          <tbody>

            {cinemas.map((cinema) => (
              <tr key={cinema.id} className="border-b">

                <td className="p-3">
                  {cinema.name}
                </td>

                <td className="p-3">
                  {cinema.address}
                </td>

                <td className="p-3 flex gap-2">

                  <EditCinemaForm cinema={cinema} />

                  <DeleteCinemaButton id={cinema.id} />

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}