"use client"

import { useMemo } from "react"

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

export default function SeatZonePreview({
  room,
  existingZones,
  verticalAisles = [],
  horizontalAisles = []
}: {
  room: { seats: Seat[], name: string }
  existingZones: SeatZone[]
  verticalAisles?: number[]
  horizontalAisles?: string[]
}) {

  const seatsPerRow = Math.max(...room.seats.map(s => s.number))
  const rowList = Array.from(new Set(room.seats.map(s => s.row))).sort()

  const cellSize = 28

  const grid = useMemo(() => {
    const g: (Seat | "aisle" | null)[][] = []

    rowList.forEach((row) => {
      if (horizontalAisles.includes(row)) {
        g.push(Array(seatsPerRow + verticalAisles.length).fill("aisle"))
        return
      }

      const rowSeats = room.seats.filter(s => s.row === row)
      const rowCells: (Seat | "aisle" | null)[] = []

      for (let n = 1; n <= seatsPerRow; n++) {
        const seat = rowSeats.find(s => s.number === n)
        if (seat) rowCells.push(seat)
        else rowCells.push(null)

        if (verticalAisles.includes(n)) rowCells.push("aisle")
      }

      g.push(rowCells)
    })

    return g
  }, [rowList, seatsPerRow, verticalAisles, horizontalAisles, room.seats])

  return (
    <div className="relative mb-4 overflow-auto border p-2 rounded max-w-full">
      {grid.map((rowCells, rowIndex) => (
        <div key={rowIndex} className="flex gap-1">
          {rowCells.map((cell, colIndex) => {
            if (cell === "aisle" || cell === null) return <div key={colIndex} style={{ width: cellSize, height: cellSize }} />

            const seat = cell as Seat
            const zone = existingZones.find(z =>
              seat.number >= z.startX &&
              seat.number <= z.endX &&
              rowIndex >= z.startY &&
              rowIndex <= z.endY
            )
            const bgColor = zone?.color || "bg-gray-300"

            return (
              <div
                key={seat.id}
                className={`rounded flex items-center justify-center text-[10px] cursor-pointer ${bgColor}`}
                style={{ width: cellSize, height: cellSize }}
              >
                {seat.row}{seat.number}
              </div>
            )
          })}
        </div>
      ))}

      {/* Render border SeatZone */}
      {existingZones.map(z => {
        let startRowIndex = 0
        let endRowIndex = 0
        let startColIndex = 0
        let endColIndex = 0

        // Rows
        for (let r = 0; r < grid.length; r++) {
          const firstSeat = grid[r].find(c => c && c !== "aisle") as Seat | undefined
          if (!firstSeat) continue
          if (firstSeat.row === rowList[z.startY]) startRowIndex = r
          if (firstSeat.row === rowList[z.endY]) endRowIndex = r
        }

        // Columns
        const firstRowSeats = grid[startRowIndex]
        for (let c = 0; c < firstRowSeats.length; c++) {
          const s = firstRowSeats[c] as Seat
          if (s && s.number === z.startX) startColIndex = c
          if (s && s.number === z.endX) endColIndex = c
        }

        const top = startRowIndex * cellSize
        const left = startColIndex * cellSize
        const width = (endColIndex - startColIndex + 1) * cellSize
        const height = (endRowIndex - startRowIndex + 1) * cellSize

        return (
          <div
            key={z.id}
            className="absolute border-2 border-blue-500 pointer-events-none rounded"
            style={{ top, left, width, height }}
          />
        )
      })}
    </div>
  )
}