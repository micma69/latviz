"use client"

import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { ArrowLongRightIcon, ArrowLongDownIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';
import { Button } from "@/components/ui/button";
import { DecapsSpyData } from '@/utils/createSpy';
import SquareGrid from "@/components/ui/gridLattice";

export default function DecapsulationVisualization({
    onSelectVariable,
    onChangeStage,
    spyData,
    step
}: { onSelectVariable: (variable: string) => void;
    onChangeStage: (stage: string) => void;
    spyData: DecapsSpyData | null;
    step: number;
 }) {
  return (
    <div className="flex flex-col items-center gap-4 h-full w-full justify-center px-4 font-mono">
        <div className="flex flex-row gap-4 items-center">
            <div className="flex flex-col gap-2 items-center justify-center bg-blue-100 rounded-xl p-5 w-fit border-2 border-blue-300">
                <div className="text-blue-700 font-semibold text-lg">Input</div>
                <div className="flex flex-row gap-4 items-center justify-center">
                    <div className="flex flex-col items-center  text-sm gap-2">
                        <div><InlineMath math="c" /></div>
                        <SquareGrid algorithm="mlkem"  colsExpanded={8} size={12} colorData={spyData?.c ? Array.from(spyData.c) : []} showValues={true} onClick={() => onSelectVariable("ciphertext_decaps")} variableKey="ciphertext_decaps" />
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                        <div><InlineMath math="dk" /></div>
                        <SquareGrid algorithm="mlkem"  colsExpanded={4} size={12} colorData={spyData?.dk ? Array.from(spyData.dk) : []} showValues={true} onClick={() => onSelectVariable("decapskey_decaps")} variableKey="decapskey_decaps" />
                    </div>
                </div>
            </div>
            {step >= 2 && <>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-row gap-4 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                    <div className="flex flex-col gap-2 items-center">
                        <div><InlineMath math="dk_{PKE}" /></div>
                        <SquareGrid algorithm="mlkem"  colsExpanded={4} size={12} colorData={spyData?.dkPKE ? Array.from(spyData.dkPKE) : []} showValues={true} onClick={() => onSelectVariable("dkPKE_decaps")} variableKey="dkPKE_decaps" />
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                        <div><InlineMath math="ek_{PKE}" /></div>
                        <SquareGrid algorithm="mlkem"  colsExpanded={4} size={12} colorData={spyData?.ekPKE ? Array.from(spyData.ekPKE) : []} showValues={true} onClick={() => onSelectVariable("ekPKE_decaps")} variableKey="ekPKE_decaps" />
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                        <div><InlineMath math="h" /></div>
                        <SquareGrid algorithm="mlkem" rows={1} cols={4} size={12} colorData={spyData?.h ? Array.from(spyData.h) : []} showValues={true} variableKey="h_decaps" onClick={() => onSelectVariable("h_decaps")} />
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                        <div><InlineMath math="z" /></div>
                        <SquareGrid algorithm="mlkem" rows={1} cols={4} size={12} colorData={spyData?.z ? Array.from(spyData.z) : []} showValues={true} variableKey="z_decaps" onClick={() => onSelectVariable("z_decaps")} />
                    </div>
                </div>
            </>}
        </div>
        {step >= 3 && <>
        <ArrowLongDownIcon className="size-6" />
            <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                    <div><InlineMath math="dk_{PKE}, c" /></div>
                </div>
                <ArrowLongRightIcon className="size-6" />
                <div
                    onClick={() => {
                        onSelectVariable("decapsulationBase1");
                        onChangeStage("decapsulation1");
                    }}
                    className="rounded-lg bg-white p-4  text-sm flex cursor-pointer items-center justify-center w-64 shadow-sm border-2 border-gray-300"
                >
                    Kyber-PKE Decrypt
                </div>
                {step >= 4 && <>
                    <ArrowLongRightIcon className="size-6" />
                    <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                        <div className="flex flex-col gap-2 items-center">
                            <div><InlineMath math="m'" /></div>
                            <SquareGrid algorithm="mlkem"  colsExpanded={8} size={12} colorData={spyData?.m ? Array.from(spyData.m) : []} showValues={true} variableKey="m_decaps" onClick={() => onSelectVariable("m_decaps")} />
                        </div>
                    </div>
                </>}
            </div>
        </>}
        {step >= 5 && <>
            <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                    <div><InlineMath math="m' \parallel h" /></div>
                    <ArrowLongRightIcon className="size-6" />
                    <div className="flex flex-col gap-2 items-center">
                        <div><InlineMath math="K'" /></div>
                        <SquareGrid algorithm="mlkem"  colsExpanded={8} size={12} colorData={spyData?.K ? Array.from(spyData.K) : []} showValues={true} variableKey="Kp_decaps" onClick={() => onSelectVariable("Kp_decaps")} />
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                        <div><InlineMath math="r'" /></div>
                        <SquareGrid algorithm="mlkem"  colsExpanded={8} size={12} colorData={spyData?.r ? Array.from(spyData.r) : []} showValues={true} variableKey="rp_decaps" onClick={() => onSelectVariable("rp_decaps")} />
                    </div>
                </div>
                {step >= 6 && <>
                    <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                        <div><InlineMath math="z \parallel c" /></div>
                        <ArrowLongRightIcon className="size-6" />
                        <div className="flex flex-col gap-2 items-center">
                            <div><InlineMath math="\bar{K}" /></div>
                            <SquareGrid algorithm="mlkem"  colsExpanded={8} size={12} colorData={spyData?.Kbar ? Array.from(spyData.Kbar) : []} showValues={true} onClick={() => onSelectVariable("kbar_decaps")} variableKey="kbar_decaps" />
                        </div>
                    </div>
                </>}
            </div>
        </>}
        {step >= 7 && <>
            <ArrowLongDownIcon className="size-6" />
            <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                    <div><InlineMath math="ek_{PKE}, m', r'" /></div>
                </div>
                <ArrowLongRightIcon className="size-6" />
                <div
                    className="rounded-lg bg-white p-4  text-sm flex items-center justify-center w-64 shadow-sm border-2 border-gray-300"
                >
                    Kyber-PKE Encrypt
                </div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                    <div className="flex flex-col items-center  text-sm gap-2">
                        <div><InlineMath math="c'" /></div>
                        <SquareGrid algorithm="mlkem"  colsExpanded={8} size={12} colorData={spyData?.c ? Array.from(spyData.c) : []} showValues={true} variableKey="cp_decaps" onClick={() => onSelectVariable("cp_decaps")} />
                    </div>
                </div>
            </div>
        </>}
        {step >= 8 && <>
            <ArrowLongDownIcon className="size-6" />
            <div className="flex flex-col gap-2 items-center justify-center bg-green-100 rounded-xl p-5 w-fit border-2 border-green-300">
                <div className="text-green-700 font-semibold text-lg">Output</div>
                <div className="flex flex-col items-center  text-sm gap-2">
                    <div className=" text-sm"><InlineMath math="K'" /></div>
                    <SquareGrid algorithm="mlkem"  colsExpanded={8} size={12} colorData={spyData?.Kfinal ? Array.from(spyData.Kfinal) : []} showValues={true} variableKey="kfinal" onClick={() => onSelectVariable("kfinal")} />
                </div>
            </div>
        </>}
        <Button
            variant="secondary"
            size="sm"
            onClick={() => onChangeStage("home")}
            className="flex justify-start cursor-pointer mt-2"
        >
            <ChevronLeftIcon className="size-6" /> BACK
        </Button>
    </div>
    );
}