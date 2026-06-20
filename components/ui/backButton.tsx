'use client'

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function BackButton() {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  return (
    <Button
      onClick={handleBack}
      variant="outline"
      className="fixed top-6 left-6 z-50 bg-slate-800/90 backdrop-blur border-slate-600 text-slate-200 shadow-lg hover:bg-slate-700 hover:text-white"
    >
      ← Back
    </Button>
  )
}
