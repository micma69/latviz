import BackButton from "@/components/ui/backButton"
import LatticeVisualizer from "@/components/ui/LatticeVisualizer"
import TabbedBox from "@/components/ui/tabBox"
import Image from "next/image";

export default function Glossary() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-12 font-sans text-slate-100 flex flex-col items-center">
            <BackButton />
            <div className="rounded-xl bg-slate-800 p-6 mb-8 mt-10 w-full md:w-3/4" id="latticedef">
                <h2 className="text-3xl mb-4 text-white flex items-center justify-center">What is a Lattice?</h2>
                <div className="flex flex-col gap-6">
                    <p className="flex justify-center text-xl text-slate-300 leading-relaxed">
                        Lattices in cryptography are defined as sets of all integer linear combinations of certain n-dimensional real space basis vectors. Even more simply, a lattice contains every combination that can be formed by adding together integer multiples of the basis vectors. The dimension (n) of the lattice depends on the amount of basis vectors, which consist of n amount of real numbers.
                    </p>
                    <p className="flex justify-center text-xl text-slate-300 leading-relaxed">
                        As the number of basis vectors increases, the lattice gets exponentially more complex. This matters because solving certain computational problems on high-dimensional lattices are believed to be extremely difficult. These problems form the security foundation of modern lattice-based cryptography.
                    </p>
                    <LatticeVisualizer />
                </div>
            </div>

            <div className="rounded-xl bg-slate-800 p-6 mb-8 mt-10 w-full md:w-3/4" id="moduledef">
                <h2 className="text-3xl mb-4 text-white flex items-center justify-center">Rings and Modules</h2>
                <div className="flex flex-col gap-6">
                    <p className="text-xl text-slate-300 leading-relaxed">
                        In the previous section, lattices were described as sets of all integer linear combinations of certain n-dimensional real space basis vectors. However, practical cryptographic schemes rarely work with vectors directly. Instead, they use algebraic structures that represent the same concept more efficiently. In particular, <span className="font-bold">rings</span> and <span className="font-bold">modules</span> are the structures used by ML-KEM and ML-DSA to perform lattice-based computations.
                    </p>
                    <p className="text-xl text-slate-300 leading-relaxed">
                        A <span className="font-bold">ring</span> is a set of elements together with rules for addition and multiplication. An example of this is the set of all integers. In lattice-based cryptography, the elements are typically polynomials instead of numbers. This allows arithmetic to be performed on entire polynomials while retaining many of the same properties as ordinary arithmetic.
                    </p>
                    <figure className="flex flex-col items-center gap-2">
                        <Image src="/RingofIntegers.jpg" width={300} height={200} alt="Integer ring"/>
                        <figcaption className="text-sm text-slate-400 italic">
                            A Ring of Integers
                        </figcaption>
                    </figure>
                    <p className="text-xl text-slate-300 leading-relaxed">
                        A <span className="font-bold">module</span> is a collection of elements from a ring arranged into vectors. If the ring contains polynomials, then a module can be thought of as a vector whose entries are polynomials. Just as lattices can be described using vectors and bases, modules provide a convenient way to represent and manipulate these structures algebraically. ML-KEM and ML-DSA use modules of polynomials because they enable efficient computations while preserving the underlying lattice structure.
                    </p>
                </div>
            </div>

            <TabbedBox
                id="latticeproblems"
                title="Lattice-based problems"
                tabs={[
                    {
                    label: "Shortest Vector Problem (SVP)",
                        content: (
                            <div className="flex flex-col items-center gap-6">
                                <p className="flex justify-center text-xl text-slate-300 leading-relaxed">
                                    The shortest vector problem is an optimization problem where the goal is to find the shortest non-zero vector within a lattice. In other words, the goal is to find the shortest distance between two points in the lattice. It sounds deceptively simple. For example, take the following two dimensional lattice.
                                </p>
                                <figure className="flex flex-col items-center gap-2">
                                    <Image src="/simple_svp.jpg" width={300} height={200} alt="2D Lattice"/>
                                    <figcaption className="text-sm text-slate-400 italic">
                                        Basis vectors are in blue. The shortest vector is in red.
                                    </figcaption>
                                </figure>
                                <p className="flex justify-center text-xl text-slate-300 leading-relaxed">
                                    Consider a lattice generated by the basis vectors (4,1) and (3,2). The shortest vector is fairly easy to spot; it is a combination of the two basis vectors, (−1,1). While this is easy to spot in two dimensions, finding the shortest vector becomes far more difficult in the hundreds or thousands of dimensions used in cryptography.
                                </p>
                            </div>
                        ),
                    },
                    {
                    label: "Learning With Errors (LWE)",
                        content: (
                            <div className="flex flex-col items-center gap-6">
                                <p className="flex justify-center text-xl text-slate-300 leading-relaxed">
                                    Learning with errors is a mathematical problem based on the idea of representing secret information as a set of equations with errors. Suppose we have the following set of equations, with s as the secret information:
                                </p>
                                <figure className="flex flex-col items-center gap-2">
                                    <Image src="/simple_lwe.jpg" width={300} height={200} alt="2D Lattice"/>
                                    <figcaption className="text-sm text-slate-400 italic">
                                        Easy to solve equations.
                                    </figcaption>
                                </figure>
                                <p className="flex justify-center text-xl text-slate-300 leading-relaxed">
                                    It is trivial to determine that s = 3. However, if we add small errors to each equation:
                                </p>
                                <figure className="flex flex-col items-center gap-2">
                                    <Image src="/error_lwe.jpg" width={300} height={200} alt="2D Lattice"/>
                                    <figcaption className="text-sm text-slate-400 italic">
                                        Equations with random errors added.
                                    </figcaption>
                                </figure>
                                <p className="flex justify-center text-xl text-slate-300 leading-relaxed">
                                    It becomes significantly more difficult to figure out what s is. In cryptography, this concept is extended from a single secret value to a secret vector hidden within a large system of equations. Each equation contains a small amount of random noise, preventing standard techniques for solving systems of equations from efficiently revealing the secret.
                                </p>
                                <figure className="flex flex-col items-center gap-2">
                                    <Image src="/simple_expansion.jpg" width={300} height={200} alt="2D Lattice"/>
                                    <figcaption className="text-sm text-slate-400 italic">
                                        Expansion of the previous example. x = 3, y = 5
                                    </figcaption>
                                </figure>
                                <p className="flex justify-center text-xl text-slate-300 leading-relaxed">
                                    How does this relate to lattices? The random errors in LWE can be viewed as small offsets from points that would otherwise lie on a lattice. Recovering the hidden secret therefore becomes closely related to finding nearby points within a high-dimensional lattice. More formally, the set of valid solutions to an LWE instance can be represented using a lattice. The added error terms slightly change these lattice points, meaning that an attacker is not searching for an exact point on the lattice but instead attempting to identify the lattice point that best explains the noisy observations.
                                </p>
                                <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
                                    <p className="text-sm text-slate-400">
                                        <span className="font-semibold text-slate-300">Note:</span> The examples above illustrate the <span className="italic">search version</span> of the Learning With Errors (LWE) problem, where the goal is to recover the hidden secret. A related <span className="italic">decision version</span> also exists, but it is not relevant to the algorithms discussed here.
                                    </p>
                                </div>
                            </div>
                        ),
                    },
                    /** 
                    {
                    label: "Short Integer Solution (SIS)",
                        content: (
                            <div className="flex flex-col items-center gap-6">
                                <p className="flex justify-center text-xl text-slate-300 leading-relaxed">
                                    later
                                </p>
                            </div>
                        ),
                    }, */  
                ]}
            />
        </div>
    );
}