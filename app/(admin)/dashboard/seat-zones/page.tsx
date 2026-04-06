import { prisma } from "@/lib/prisma"
import CreateSeatZoneForm from "./CreateSeatZoneForm"
import DeleteSeatZoneButton from "./DeleteSeatZoneButton"
import EditSeatZoneForm from "./EditSeatZoneForm"

export default async function Page() {

  const seatZones = await prisma.seatZone.findMany({
    include: {
      room: true
    },
    orderBy: {
      roomId: "asc"
    }
  })

  const rooms = await prisma.room.findMany()

  return (

    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Seat Zones</h1>

      <CreateSeatZoneForm rooms={rooms} />

      <table className="w-full border">

        <thead className="bg-gray-100">
          <tr>
            <th>Room</th>
            <th>Color</th>
            <th>X</th>
            <th>Y</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {seatZones.map((z) => (

            <tr key={z.id} className="border-t">

              <td>{z.room.name}</td>

              <td>
                <div
                  className="w-6 h-6 rounded"
                  style={{ background: z.color || "gray" }}
                />
              </td>

              <td>
                {z.startX} → {z.endX}
              </td>

              <td>
                {z.startY} → {z.endY}
              </td>

              <td className="flex gap-2">

                <EditSeatZoneForm zone={z} />

                <DeleteSeatZoneButton id={z.id} />

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )
}