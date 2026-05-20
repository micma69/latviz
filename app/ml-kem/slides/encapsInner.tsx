"use client";

import { useEffect, useState } from "react";
import SquareGrid from "@/components/ui/gridLattice";
import { ChevronLeftIcon, ArrowLongRightIcon, ArrowLongDownIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { InlineMath } from "react-katex";
import { EncapsSpyData } from '@/utils/createSpy';

export default function EncapsulationVisualizationProcess({
  onSelectVariable,
  onChangeStage,
  spyData
}: {
  onSelectVariable: (variable: string) => void;
  onChangeStage: (stage: string) => void;
  spyData: EncapsSpyData | null;
}) {
  return (
    <div className="flex flex-col items-center gap-4 h-full w-full justify-center px-4 font-mono">
        <div className="flex flex-col gap-2 items-center justify-center bg-blue-100 rounded-xl p-5 w-fit border-2 border-blue-300">
            <div className="text-blue-700 font-semibold text-lg">Input</div>   
            <div className="flex flex-row gap-8 items-center justify-center">
                <div className="flex flex-col items-center  text-sm gap-2">
                    <div><InlineMath math="m" /></div>
                    <SquareGrid algorithm="mlkem" rows={1} cols={4} size={12} colorData={spyData?.m ? Array.from(spyData.m) : []} showValues={true} variableKey="m_encaps" onClick={() => onSelectVariable("m_encaps")} />
                </div>
                <div className="flex flex-col items-center  text-sm gap-2">
                    <div><InlineMath math="r" /></div>
                    <SquareGrid algorithm="mlkem" rows={1} cols={4} size={12} colorData={spyData?.r ? Array.from(spyData.r) : []} showValues={true} variableKey="r_encaps" onClick={() => onSelectVariable("r_encaps")} />
                </div>
                <div className="flex flex-col items-center  text-sm gap-2">
                    <div><InlineMath math="ek" /></div>
                    <SquareGrid algorithm="mlkem" rows={1} cols={4} size={12} colorData={spyData?.ek ? Array.from(spyData.ek) : []} showValues={true} variableKey="encapskey_encaps" onClick={() => onSelectVariable("encapskey_encaps")} />
                </div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-col items-center  text-sm gap-2">
                    <div><InlineMath math="\rho" /></div>
                    <SquareGrid algorithm="mlkem"
                        rows={1} cols={4} rowsExpanded={8} size={12}
                        colorData={spyData?.rho ? Array.from(spyData.rho) : []}
                        showValues variableKey="rho_encaps" onClick={() => onSelectVariable("rho_encaps")}
                    />
                </div>
                <div className="flex flex-col items-center  text-sm gap-2">
                    <div><InlineMath math="t" /></div>
                    <SquareGrid algorithm="mlkem" rows={1} cols={4} size={12} colorData={spyData?.tHat[0] ? Array.from(spyData.tHat[0]) : []} variableKey="t_encaps" showValues onClick={() => onSelectVariable("t_encaps")}  />
                </div>
            </div>            
        </div>
        <div className="flex flex-row gap-4">
            <div className="flex flex-col gap-4 items-center">
                <ArrowLongDownIcon className="size-6" />
                <div className="flex flex-col gap-2 items-center justify-center bg-orange-100 rounded-xl p-5 w-fit border-2 border-orange-300">
                    <div className="flex flex-col items-center  text-sm gap-2">
                        <div><InlineMath math="\mu" /></div>
                        <SquareGrid algorithm="mlkem" rows={8} cols={1} size={15} colorData={spyData?.mu ? Array.from(spyData.mu) : []} showValues variableKey="mu_encaps" onClick={() => onSelectVariable("mu_encaps")} />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4 items-center">
                <ArrowLongDownIcon className="size-6" />
                <div className="flex flex-col gap-2 items-center justify-center bg-orange-100 rounded-xl p-5 w-fit border-2 border-orange-300">
                    <div className="flex flex-col items-center  text-sm gap-2">
                        <div><InlineMath math="A" /></div>
                        <SquareGrid algorithm="mlkem"
                            rows={1} cols={4} rowsExpanded={8} size={12}
                            colorData={spyData?.A?.[0]?.[0] ? Array.from(spyData.A[0][0]) : []}
                            showValues variableKey="A_encaps" onClick={() => onSelectVariable("A_encaps")}
                        />
                    </div>
                </div>
            </div>
        <div className="flex flex-col gap-4 items-center">
            <ArrowLongDownIcon className="size-6" />
            <div className="flex flex-col gap-2 items-center justify-center bg-orange-100 rounded-xl p-5 w-fit border-2 border-orange-300">
                <div className="flex flex-col items-center  text-sm gap-2">
                    <div><InlineMath math="y" /></div>
                    <SquareGrid algorithm="mlkem" rows={8} cols={1} size={15} colorData={spyData?.y[0] ? Array.from(spyData.y[0]) : []} showValues variableKey="y_encaps" onClick={() => onSelectVariable("y_encaps")} />
                </div>
            </div>
        </div>
        <div className="flex flex-col gap-4 items-center">
            <ArrowLongDownIcon className="size-6" />
            <div className="flex flex-col gap-2 items-center justify-center bg-orange-100 rounded-xl p-5 w-fit border-2 border-orange-300">
                <div className="flex flex-col items-center  text-sm gap-2">
                    <div><InlineMath math="e_1" /></div>
                    <SquareGrid algorithm="mlkem" rows={8} cols={1} size={15} colorData={spyData?.e1[0] ? Array.from(spyData.e1[0]) : []} showValues variableKey="e1_encaps" onClick={() => onSelectVariable("e1_encaps")} />
                </div>
            </div>
        </div>
        <div className="flex flex-col gap-4 items-center">
            <ArrowLongDownIcon className="size-6" />
            <div className="flex flex-col gap-2 items-center justify-center bg-orange-100 rounded-xl p-5 w-fit border-2 border-orange-300">
                <div className="flex flex-col items-center  text-sm gap-2">
                    <div><InlineMath math="e_2" /></div>
                    <SquareGrid algorithm="mlkem" rows={8} cols={1} size={15} colorData={spyData?.e2 ? Array.from(spyData.e2) : []} showValues variableKey="e2_encaps" onClick={() => onSelectVariable("e2_encaps")} />
                </div>
            </div>
        </div>
        </div>
        <ArrowLongDownIcon className="size-6" />
        <div className="flex flex-row gap-2 items-center justify-center bg-orange-100 rounded-xl p-5 w-fit border-2 border-orange-300">
            <div><InlineMath math="(\hat{A}^T \cdot \hat{y}) + e_1" /></div>
            <ArrowLongRightIcon className="size-6" />
            <div className="flex flex-col items-center  text-sm gap-2">
                <div className=" text-sm"><InlineMath math="u" /></div>
                <SquareGrid algorithm="mlkem" rows={8} cols={1} size={15} colorData={spyData?.u[0] ? Array.from(spyData.u[0]) : []} showValues variableKey="u_encaps" onClick={() => onSelectVariable("u_encaps")} />
            </div>
            <ArrowLongRightIcon className="size-6" />
            <div className="flex flex-col items-center  text-sm gap-2">
                <div className=" text-sm"><InlineMath math="c_1" /></div>
                <SquareGrid algorithm="mlkem" rows={4} cols={1} size={15} colorData={spyData?.c1 ? Array.from(spyData.c1) : []} showValues={true} variableKey="c1_encaps" onClick={() => onSelectVariable("c1_encaps")} />
            </div>
        </div>
        <div className="flex flex-row gap-2 items-center justify-center bg-orange-100 rounded-xl p-5 w-fit border-2 border-orange-300">
            <div><InlineMath math="(\hat{t}^T \cdot \hat{y}) + e_2 + \mu)" /></div>
            <ArrowLongRightIcon className="size-6" />
            <div className="flex flex-col items-center  text-sm gap-2">
                <div className=" text-sm"><InlineMath math="v" /></div>
                <SquareGrid algorithm="mlkem" rows={8} cols={1} size={15} colorData={spyData?.v ? Array.from(spyData.v) : []} showValues variableKey="v_encaps" onClick={() => onSelectVariable("v_encaps")} />
            </div>
            <ArrowLongRightIcon className="size-6" />
            <div className="flex flex-col items-center  text-sm gap-2">
                <div className=" text-sm"><InlineMath math="c_2" /></div>
                <SquareGrid algorithm="mlkem" rows={4} cols={1} size={15} colorData={spyData?.c2 ? Array.from(spyData.c2) : []} showValues={true} variableKey="c2_encaps" onClick={() => onSelectVariable("c2_encaps")} />
            </div>
        </div>
        <ArrowLongDownIcon className="size-6" />
        <div className="flex flex-col gap-2 items-center justify-center bg-green-100 rounded-xl p-5 w-fit border-2 border-green-300">
            <div className="text-green-700 font-semibold text-lg">Output</div>
            <div className="flex flex-row gap-2 items-center">
                <div className=" text-sm"><InlineMath math="c_1 \parallel c_2" /></div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-col items-center  text-sm gap-2">
                    <div className=" text-sm"><InlineMath math="c" /></div>
                    <SquareGrid algorithm="mlkem" rows={1} cols={4} size={12} colorData={spyData?.cipherText} showValues={true} variableKey="ciphertext_encaps" onClick={() => onSelectVariable("ciphertext_encaps")} />
                </div>
            </div>
        </div>
        <Button
            variant="secondary"
            size="sm"
            onClick={() => onChangeStage("encapsulation0")}
            className="flex justify-start cursor-pointer mt-2"
        >
            <ChevronLeftIcon className="size-6" /> BACK
        </Button>
    </div>
  );
}