"use client"

import { createCinema } from "./actions"

export default function CreateCinemaForm() {

  return (
    <form
      action={createCinema}
      className="bg-white p-6 rounded-xl shadow space-y-4"
    >

      <h2 className="text-lg font-semibold text-red-600">
        Create Cinema
      </h2>

      <div className="space-y-3">

        <div>
          <label className="text-sm text-gray-600">
            Cinema Name
          </label>

          <input
            name="name"
            required
            className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">
            Address
          </label>

          <input
            name="address"
            required
            className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-red-500"
          />
        </div>

      </div>

      <button
        className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
      >
        Create Cinema
      </button>

    </form>
  )
}