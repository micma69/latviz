import Link from "next/link";
import { Button } from "@/components/ui/button"
import LatticeVisualizer from "@/components/ui/LatticeVisualizer"

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-12 font-sans text-slate-100 flex flex-col items-center">
            <div className="mx-auto w-full max-w-4xl text-center">
                <h1 className="text-5xl font-semibold tracking-tight text-white">Latviz</h1>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
                  Visualizes lattice-based post-quantum cryptographic & cryptanalysis algorithms 
                </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-6 mb-8 mt-10">
                <h2 className="text-3xl mb-4 text-white flex items-center justify-center">What is a Lattice?</h2>
                <div className="flex flex-col gap-6">
                    <p className="flex justify-center text-xl text-slate-300 leading-relaxed">
                        Lattices in cryptography are defined as sets of all integer linear combinations of certain n-dimensional real space basis vectors. Even more simply, a lattice contains every combination that can be formed by adding together integer multiples of the basis vectors. The dimension (n) of the lattice depends on the amount of basis vectors, which consist of n amount of real numbers.
                    </p>
                    <p className="flex justify-center text-xl text-slate-300 leading-relaxed">
                        As the number of basis vectors increases, the lattice gets exponentially more complex. This matters because solving certain computational problems on high-dimensional lattices are believed to be extremely difficult. These problems form the security foundation of modern lattice-based algorithms.
                    </p>
                    <div className="lg:w-1/2">
                        <LatticeVisualizer />
                    </div>
                </div>
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
