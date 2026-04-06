import { prisma } from "@/lib/prisma"
import CreateSeatForm from "./CreateSeatForm"
import DeleteSeatButton from "./DeleteSeatButton"
import GenerateSeatsForm from "./GenerateSeatsForm"

export default async function Page({
    params
}: { params: Promise<{ roomId: string }>; }) {

    const {roomId} = await params

    const room = await prisma.room.findUnique({
        where: { id: roomId },
        include: {
            seats: {
                orderBy: [
                    { row: "asc" },
                    { number: "asc" }
                ]
            }
        }
    })

    const rows = Array.from(new Set(room?.seats.map(s => s.row)))

    return (

        <div className="p-6">

            <h1 className="text-2xl font-bold text-red-600 mb-4">
                Seats - {room?.name}
            </h1>

            <CreateSeatForm roomId={roomId} />

            <GenerateSeatsForm roomId={roomId} />

            <div className="mt-6 space-y-4">

                {rows.map(row => (

                    <div key={row} className="flex flex-wrap gap-2">

                        <span className="w-8 font-bold text-red-600">
                            {row}
                        </span>

                        {room?.seats
                            .filter(s => s.row === row)
                            .map(seat => (

                                <div
                                    key={seat.id}
                                    className="flex items-center gap-1 bg-red-100 px-2 py-1 rounded"
                                >

                                    <span>
                                        {seat.row}{seat.number}
                                    </span>

                                    <DeleteSeatButton
                                        id={seat.id}
                                        roomId={roomId}
                                    />

                                </div>

                            ))}

                    </div>

                ))}

            </div>

        </div>
    )
}