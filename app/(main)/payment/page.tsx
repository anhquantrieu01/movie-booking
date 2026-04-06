"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function PaymentPage() {
  const params = useSearchParams()
  const router = useRouter()

  const bookingId = params.get("bookingId")

  const [timeLeft, setTimeLeft] = useState(600) // 10 phút

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          alert("Hết thời gian giữ ghế!")
          router.push("/")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const handlePay = async (success: boolean) => {
    const res = await fetch("/api/payment/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, success })
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.error)
      return
    }

    router.push("/my-tickets")
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">

      <h1 className="text-3xl text-red-500 font-bold">
        Thanh toán
      </h1>

      {/* Countdown */}
      <div className="text-xl text-yellow-400">
        ⏳ Thời gian giữ ghế: {minutes}:{seconds.toString().padStart(2, "0")}
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => handlePay(true)}
          className="bg-green-500 px-6 py-3 rounded-lg"
        >
          Thanh toán thành công
        </button>

        <button
          onClick={() => handlePay(false)}
          className="bg-red-500 px-6 py-3 rounded-lg"
        >
          Thanh toán thất bại
        </button>
      </div>
    </div>
  )
}