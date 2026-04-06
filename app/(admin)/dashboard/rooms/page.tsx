import { prisma } from "@/lib/prisma"
import CreateRoomForm from "./CreateRoomForm"
import EditRoomForm from "./EditRoomForm"
import DeleteRoomButton from "./DeleteRoomButton"
import Link from "next/link"

export default async function Page() {

  const rooms = await prisma.room.findMany({
    include:{
      cinema:true,
      _count:{
        select:{ seats:true }
      }
    },
    orderBy:{
      name:"asc"
    }
  })

  const cinemas = await prisma.cinema.findMany()

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold text-red-600 mb-6">
        Room Management
      </h1>

      <CreateRoomForm cinemas={cinemas} />

      <div className="overflow-x-auto mt-6">

        <table className="w-full border rounded-lg">

          <thead className="bg-red-600 text-white">
            <tr>
              <th className="p-3 text-left">Room</th>
              <th className="p-3 text-left">Cinema</th>
              <th className="p-3 text-left">Seats</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>

            {rooms.map(room => (

              <tr
                key={room.id}
                className="border-b hover:bg-red-50"
              >

                <td className="p-3 font-medium">
                    <Link href={`/dashboard/rooms/${room.id}/seats`}>{room.name}</Link>
                </td>

                <td className="p-3">
                  {room.cinema.name}
                </td>

                <td className="p-3">
                  {room._count.seats}
                </td>

                <td className="p-3 flex justify-end gap-2">

                  <EditRoomForm room={room} />

                  <DeleteRoomButton id={room.id} />

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}