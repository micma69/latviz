"use client"

import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { ArrowLongDownIcon, ArrowLongRightIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';
import { Button } from "@/components/ui/button";
import SquareGrid from "@/components/ui/gridLattice";
import { KeygenSpyData } from '@/utils/createSpy';

export default function KeygenVisualizationProcess({
    onSelectVariable,
    onChangeStage,
    spyData,
    step,
}: {
    onSelectVariable: (variable: string) => void;
    onChangeStage: (stage: string) => void;
    spyData: KeygenSpyData | null;
    step: number;
}) {
    return (
        <div className="flex flex-col items-center gap-4 h-full w-full justify-center px-4 font-mono">

            {/* Stage 1: Input — always visible */}
            <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-col gap-2 items-center justify-center bg-blue-100 rounded-xl p-5 w-fit border-2 border-blue-300">
                    <div className="text-blue-700 font-semibold text-lg">Input</div>
                    <div className="flex flex-col items-center text-sm gap-2">
                        <div><InlineMath math="d" /></div>
                        <SquareGrid algorithm="mlkem"  size={12}
                            colorData={spyData?.d ? Array.from(spyData.d) : []}
                            showValues variableKey="d" onClick={() => onSelectVariable("d")} />
                    </div>
                </div>

                {/* Stage 2: + ρ and σ */}
                {step >= 2 && <>
                    <ArrowLongRightIcon className="size-6" />
                    <div className="flex flex-row gap-4 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                        <div className="flex flex-col items-center text-sm gap-2">
                            <div><InlineMath math="\rho" /></div>
                            <SquareGrid algorithm="mlkem"  size={12}
                                colorData={spyData?.rho ? Array.from(spyData.rho) : []}
                                showValues variableKey="rho_keygen" onClick={() => onSelectVariable("rho_keygen")} />
                        </div>
                        <div className="flex flex-col items-center text-sm gap-2">
                            <div><InlineMath math="\sigma" /></div>
                            <SquareGrid algorithm="mlkem"  size={12}
                                colorData={spyData?.sigma ? Array.from(spyData.sigma) : []}
                                showValues variableKey="sigma_keygen" onClick={() => onSelectVariable("sigma_keygen")} />
                        </div>
                    </div>
                </>}
            </div>

            {/* Stage 3: + A, s, e */}
            {step >= 3 && <>
                <ArrowLongDownIcon className="size-6" />
                <div className="flex flex-row gap-4 items-center">
                    {[
                        { label: "A", data: spyData?.A?.[0]?.[0] ? Array.from(spyData.A[0][0]) : [], key: "A_keygen" },
                        { label: "s", data: spyData?.sHat[0] ? Array.from(spyData.sHat[0]) : [], key: "s_keygen" },
                        { label: "e", data: spyData?.eHat[0] ? Array.from(spyData.eHat[0]) : [], key: "e_keygen" },
                    ].map(({ label, data, key }) => (
                        <div key={key} className="flex flex-col gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                            <div className="flex flex-col items-center text-sm gap-2">
                                <div><InlineMath math={label} /></div>
                                <SquareGrid algorithm="mlkem"  size={12}
                                    colorData={data} showValues variableKey={key} onClick={() => onSelectVariable(key)} />
                            </div>
                        </div>
                    ))}
                </div>
            </>}

            {/* Stage 4: + t box */}
            {step >= 4 && <>
                <ArrowLongDownIcon className="size-6" />
                <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                    <div><InlineMath math="A \cdot s + e" /></div>
                    <ArrowLongRightIcon className="size-6" />
                    <div className="flex flex-col items-center text-sm gap-2">
                        <div><InlineMath math="t" /></div>
                        <SquareGrid algorithm="mlkem"  size={12}
                            colorData={spyData?.tHat[0] ? Array.from(spyData.tHat[0]) : []}
                            showValues variableKey="t_keygen" onClick={() => onSelectVariable("t_keygen")} />
                    </div>
                </div>
            </>}

            {/* Stage 5: + output */}
            {step >= 5 && <>
                <ArrowLongDownIcon className="size-6" />
                <div className="flex flex-col gap-2 items-center justify-center bg-green-100 rounded-xl p-5 w-fit border-2 border-green-300">
                    <div className="text-green-700 font-semibold text-lg">Output</div>
                    <div className="flex flex-row gap-8 items-center justify-center">
                        <div className="flex flex-col items-center justify-center text-sm gap-2">
                            <InlineMath math="ek_{PKE}" />
                            <SquareGrid algorithm="mlkem" rows={8} cols={8} size={4}
                                colorData={spyData?.ekPKE ? Array.from(spyData.ekPKE) : []}
                                showValues showTooltip variableKey="ekPKE_keygen" onClick={() => onSelectVariable("ekPKE_keygen")} />
                        </div>
                        <div className="flex flex-col items-center justify-center text-sm gap-2">
                            <InlineMath math="dk_{PKE}" />
                            <SquareGrid algorithm="mlkem" rows={8} cols={8} size={4}
                                colorData={spyData?.dkPKE ? Array.from(spyData.dkPKE) : []}
                                showValues showTooltip variableKey="dkPKE_keygen" onClick={() => onSelectVariable("dkPKE_keygen")} />
                        </div>
                    </div>
                </div>
            </>}

            <Button variant="secondary" size="sm" onClick={() => onChangeStage("keygen0")}
                className="flex justify-start cursor-pointer mt-2">
                <ChevronLeftIcon className="size-6" /> BACK
            </Button>
        </div>
    );
}