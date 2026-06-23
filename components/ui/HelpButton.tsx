"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function HelpButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="secondary"
        size="icon"
        className="fixed right-6 top-6 z-50 h-12 w-12 rounded-full border border-slate-700 bg-slate-800/90 text-2xl font-semibold text-white hover:bg-slate-700/90"
        type="button"
        aria-expanded={open}
        aria-controls="help-modal"
        onClick={() => setOpen((prev) => !prev)}
      >
        ?
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            id="help-modal"
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 transform rounded-2xl border border-slate-700 bg-slate-900/95 p-8 text-slate-300 shadow-2xl"
          >
            <h2 className="text-2xl font-semibold text-white">About these algorithms</h2>
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-2xl text-slate-400 hover:text-slate-200"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="mt-6 space-y-4">
              <div>
                <h3 className="font-semibold text-white">ML-KEM</h3>
                <p className="mt-1 text-sm text-slate-400">A key encapsulation scheme that establish a shared private key between two parties. The standardized version of CRYSTALS-Kyber by National Institute of Standards and Technology (NIST).</p>
              </div>
              <div>
                <h3 className="font-semibold text-white">ML-DSA</h3>
                <p className="mt-1 text-sm text-slate-400">A lattice-based digital signature algorithm. The standardized version of CRYSTALS-Dilithium by NIST.</p>
              </div>
              <div>
                <h3 className="font-semibold text-white">LLL</h3>
                <p className="mt-1 text-sm text-slate-400">A lattice basis reduction algorithm. This algorithm is used to evaluate lattice-based post quantum cryptography algorithms such as ML-KEM and ML-DSA.</p>
              </div>
              <div>
                <h3 className="font-semibold text-white">BKZ</h3>
                <p className="mt-1 text-sm text-slate-400">A stronger block-wise reduction algorithm. BKZ is computationally more expensive but more powerful than LLL. Like LLL, BKZ is also commonly used to evaluate lattice-based post quantum cryptography algorithms such as ML-KEM and ML-DSA.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
