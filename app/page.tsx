import Link from "next/link";
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-12 font-sans text-slate-100">
      <div className="mx-auto w-full max-w-4xl text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-white">Latviz</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
          Visualizes lattice-based post-quantum cryptographic & cryptanalysis algorithms 
        </p>
      </div>

      <main className="mx-auto mt-10 w-full max-w-3xl flex-col rounded-[2rem] border border-slate-700 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/40">
        <div className="grid gap-8 sm:grid-cols-2">
          <Button className="w-full h-full min-h-[150px] rounded-3xl border border-slate-700 bg-slate-900/80 px-6 text-center text-white hover:bg-slate-800/90 focus-visible:ring-white/30 flex items-center justify-center" asChild variant="secondary">
            <Link href="/ml-kem">ML-KEM / FIPS 203</Link>
          </Button>
          <Button className="w-full h-full min-h-[150px] rounded-3xl border border-slate-700 bg-slate-900/80 px-6 text-center text-white hover:bg-slate-800/90 focus-visible:ring-white/30 flex items-center justify-center" asChild variant="secondary">
            <Link href="/ml-dsa">ML-DSA / FIPS 204</Link>
          </Button>
          <Button className="w-full h-full min-h-[150px] rounded-3xl border border-slate-700 bg-slate-900/80 px-6 text-center text-white hover:bg-slate-800/90 focus-visible:ring-white/30 flex items-center justify-center" asChild variant="secondary">
            <Link href="/lll">LLL</Link>
          </Button>
          <Button className="w-full h-full min-h-[150px] rounded-3xl border border-slate-700 bg-slate-900/80 px-6 text-center text-white hover:bg-slate-800/90 focus-visible:ring-white/30 flex items-center justify-center" asChild variant="secondary">
            <Link href="/bkz">BKZ</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
