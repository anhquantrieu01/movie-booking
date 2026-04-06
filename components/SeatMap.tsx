"use client"

import { useState, useEffect, useMemo } from "react"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"

type Seat = {
    id: string
    row: string
    number: number
}

type SeatZone = {
    id: string
    startX: number
    endX: number
    startY: number
    endY: number
    color?: string
}

type Room = {
    seats: Seat[]
    seatZones: SeatZone[]
    verticalAisles?: number[]
    horizontalAisles?: string[]
}

export default function SeatMap({
    showtime,
    bookedSeatIds
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    showtime: any,
    bookedSeatIds: string[]
}) {

    const room: Room = showtime.room

    // 🔥 tối ưu bằng useMemo
    const seatsPerRow = useMemo(
        () => Math.max(...room.seats.map(s => s.number)),
        [room.seats]
    )

    const rowList = useMemo(
        () => Array.from(new Set(room.seats.map(s => s.row))).sort(),
        [room.seats]
    )

    const verticalAisles = room.verticalAisles || []
    const horizontalAisles = room.horizontalAisles || []

    const [selectedSeats, setSelectedSeats] = useState<string[]>([])
    const [bookedSeats, setBookedSeats] = useState<string[]>(bookedSeatIds)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/showtime/${showtime.id}/seats`)
                const data = await res.json()

                setBookedSeats(data.bookedSeatIds)

                // remove ghế đã bị người khác lấy khỏi selected
                setSelectedSeats(prev =>
                    prev.filter(id => !data.bookedSeatIds.includes(id))
                )
            } catch (err) {
                console.error("Refresh seats error", err)
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [showtime.id])

    useEffect(() => {
        setBookedSeats(bookedSeatIds)
    }, [bookedSeatIds])

    const toggleSeat = (seatId: string) => {
        setSelectedSeats(prev =>
            prev.includes(seatId)
                ? prev.filter(id => id !== seatId)
                : [...prev, seatId]
        )
    }

    const calculateTotal = () => {
        return selectedSeats.length * showtime.price
    }

    const handleBooking = async () => {
        if (!selectedSeats.length) return alert("Chọn ghế trước!")

        setLoading(true)

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    showtimeId: showtime.id,
                    seatIds: selectedSeats,
                    paymentMethod: "VNPAY"
                })
            })

            const data = await res.json()

            if (!res.ok) {
                if (res.status === 409) {
                    alert("Ghế đã được đặt: " + data.bookedSeatIds.join(", "))
                    setBookedSeats(prev => [...prev, ...data.bookedSeatIds])
                    setSelectedSeats(prev =>
                        prev.filter(id => !data.bookedSeatIds.includes(id))
                    )
                    return
                }

                throw new Error(data.error)
            }

            const booking = data?.booking
            console.log(booking)

            const paymentRes = await fetch("/api/payment/vnpay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bookingId: booking.id,
                    amount: calculateTotal()
                })
            })

            const paymentData = await paymentRes.json()

            window.location.href = paymentData.paymentUrl

        } catch (err) {
            console.error(err)
            alert("Lỗi hệ thống, thử lại sau")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-5xl overflow-x-auto mx-auto p-10 bg-black rounded-lg text-white">



            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 p-4 mb-4 text-xs sm:text-sm">
                <Legend color="bg-gray-700" label="Ghế trống" />
                <Legend color="bg-red-600" label="Đã đặt" />
                <Legend color="bg-red-400" label="Đang chọn" />
            </div>

            {/* Seat Map */}
            <div className="border border-gray-700 p-1 sm:p-2 rounded shadow overflow-x-auto">
                <TransformWrapper
                    initialScale={1}
                    minScale={0.5}
                    maxScale={2}
                    centerOnInit
                    wheel={{ step: 0.1 }}
                    doubleClick={{ disabled: true }}
                >
                    <TransformComponent>
                        <div
                            className="relative"
                            style={{
                                width: seatsPerRow * 31,
                                minHeight: rowList.length * 31,
                            }}
                        >
                            {rowList.map((row) => {
                                if (horizontalAisles.includes(row))
                                    return <div key={row} className="h-6"></div>

                                const rowSeats = room.seats.filter(s => s.row === row)

                                return (
                                    <div key={row} className="flex gap-1 mb-1">

                                        {Array.from({ length: seatsPerRow }, (_, i) => {
                                            if (verticalAisles.includes(i))
                                                return <div key={`aisle-${i}`} className="w-4"></div>

                                            const seat = rowSeats.find(s => s.number === i + 1)

                                            if (!seat)
                                                return <div key={`empty-${i}`} className="w-7 h-7" />

                                            const isBooked = bookedSeats.includes(seat.id)
                                            const isSelected = selectedSeats.includes(seat.id)

                                            const bgColor = isBooked
                                                ? "bg-red-600"
                                                : isSelected
                                                    ? "bg-red-400"
                                                    : "bg-gray-700"

                                            return (
                                                <div
                                                    key={seat.id}
                                                    onClick={() => {
                                                        if (isBooked || loading) return
                                                        toggleSeat(seat.id)
                                                    }}
                                                    className={`
                                                        w-7 h-7 text-[10px] rounded
                                                        flex items-center justify-center
                                                        transition
                                                        ${!isBooked ? "cursor-pointer hover:scale-110" : "cursor-not-allowed opacity-60"}
                                                        ${bgColor}
                                                    `}
                                                >
                                                    {seat.row}{seat.number}
                                                </div>
                                            )
                                        })}

                                    </div>
                                )
                            })}

                            {/* Seat Zones */}
                            {/* {room.seatZones.map(z => (
                                <div
                                    key={z.id}
                                    className="absolute border-2 border-red-600 rounded pointer-events-none"
                                    style={{
                                        top: z.startY * 31,
                                        left: (z.startX - 1) * 31,
                                        width: (z.endX - z.startX + 1) * 31,
                                        height: (z.endY - z.startY + 1) * 31
                                    }}
                                />
                            ))} */}
                        </div>
                    </TransformComponent>
                </TransformWrapper>
            </div>

            {selectedSeats.length > 0 && (
                <p className="mt-3 text-gray-300 text-sm">
                    Ghế đang chọn: {selectedSeats.length}
                </p>
            )}

            {selectedSeats.length > 0 && (
                <p className="mt-2 text-red-400 font-bold text-lg">
                    Tổng tiền: {calculateTotal().toLocaleString()} đ
                </p>
            )}

            <button
                onClick={handleBooking}
                disabled={loading || !selectedSeats.length}
                className={`mt-4 px-4 py-2 rounded transition ${loading || !selectedSeats.length
                    ? "bg-gray-600"
                    : "bg-red-600 hover:bg-red-700"
                    }`}
            >
                {loading
                    ? "Đang xử lý..."
                    : `Thanh toán (${selectedSeats.length}) - ${calculateTotal().toLocaleString()} đ`
                }
            </button>
        </div>
    )
}

function Legend({ color, label }: { color: string; label: string }) {
    return (
        <div className="flex items-center gap-1">
            <div className={`w-5 h-5 ${color} rounded`} />
            <span className="text-gray-300">{label}</span>
        </div>
    )
}