/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useMemo } from "react"
import { generateSeats } from "./generateSeats"

export default function GenerateSeatsForm({ roomId }: { roomId: string }) {
  const [rows, setRows] = useState("A-L")
  const [seats, setSeats] = useState(16)
  const [verticalAisles, setVerticalAisles] = useState("6,12")
  const [horizontalAisles, setHorizontalAisles] = useState("C,F")

  // Tính layout seat map cho preview
  const layout = useMemo(() => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const [start, end] = rows.split("-")
    const startIndex = alphabet.indexOf(start)
    const endIndex = alphabet.indexOf(end)
    const rowList = alphabet.slice(startIndex, endIndex + 1).split("")

    const verticalAisleArray = verticalAisles
      .split(",")
      .map(a => Number(a.trim()))
      .filter(Boolean)
    const horizontalAisleArray = horizontalAisles
      .split(",")
      .map(r => r.trim().toUpperCase())
      .filter(Boolean)

    const grid: any[] = []

    rowList.forEach((row) => {
      const rowCells: any[] = []

      for (let n = 1; n <= seats; n++) {
        // chèn lối đi dọc
        if (verticalAisleArray.includes(n - 1)) {
          rowCells.push({ type: "aisle" })
        }

        rowCells.push({ type: "seat", label: `${row}${n}` })
      }

      // nếu row là horizontal aisle → chèn 1 row trống
      if (horizontalAisleArray.includes(row)) {
        grid.push(rowCells.map(() => ({ type: "aisle" })))
      }

      grid.push(rowCells)
    })

    return grid
  }, [rows, seats, verticalAisles, horizontalAisles])

  return (
    <form
      action={generateSeats}
      className="flex flex-col gap-4 bg-red-50 p-4 rounded mt-4"
    >
      <input type="hidden" name="roomId" value={roomId} />

      {/* Inputs */}
      <div className="flex gap-2 flex-wrap">
        <input
          name="rows"
          value={rows}
          onChange={(e) => setRows(e.target.value)}
          placeholder="Rows (A-L)"
          className="border p-2 rounded"
        />
        <input
          name="seats"
          type="number"
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
          placeholder="Seats per row"
          className="border p-2 rounded w-40"
        />
        <input
          name="verticalAisles"
          value={verticalAisles}
          onChange={(e) => setVerticalAisles(e.target.value)}
          placeholder="Vertical aisles (6,12)"
          className="border p-2 rounded w-40"
        />
        <input
          name="horizontalAisles"
          value={horizontalAisles}
          onChange={(e) => setHorizontalAisles(e.target.value)}
          placeholder="Horizontal aisles (C,F)"
          className="border p-2 rounded w-40"
        />
        <button className="bg-red-600 text-white px-4 rounded">Generate</button>
      </div>

      {/* Preview seat map */}
      <div className="mt-4 space-y-1 overflow-auto">
        {layout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {row.map((cell: any, cellIndex: number) => {
              if (cell.type === "aisle") {
                return <div key={cellIndex} className="w-6 h-6" />
              }
              return (
                <div
                  key={cellIndex}
                  className="w-7 h-7 text-[10px] bg-gray-300 rounded flex items-center justify-center"
                >
                  {cell.label}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </form>
  )
}