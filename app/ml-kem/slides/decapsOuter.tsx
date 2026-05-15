"use client"

import React, { useEffect, useState } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { ArrowLongRightIcon, ArrowLongDownIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';
import { Button } from "@/components/ui/button";
import { DecapsSpyData } from '@/utils/createSpy';
import SquareGrid from "@/components/ui/gridLattice";

export default function DecapsulationVisualization({
  onSelectVariable,
  onChangeStage,
  spyData
}: { onSelectVariable: (variable: string) => void;
    onChangeStage: (stage: string) => void;
    spyData: DecapsSpyData | null;
    
 }) {
  return (
    <div className="flex flex-col items-center gap-4 h-full w-full justify-center px-4">
        <div className="flex flex-row gap-4 items-center">
            <div className="flex flex-col gap-2 items-center justify-center bg-blue-100 rounded-xl p-5 w-fit border-2 border-blue-300">
                <div className="text-blue-700 font-semibold text-lg">Input</div>
                <div className="flex flex-row gap-8 items-center justify-center">
                    <div className="flex flex-col items-center font-mono text-sm gap-2">
                        <div><InlineMath math="c" /></div>
                        <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={8} size={12} colorData={spyData?.c ? Array.from(spyData.c) : []} showValues={true} />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2 items-center justify-center bg-blue-100 rounded-xl p-5 w-fit border-2 border-blue-300">
                <div className="text-blue-700 font-semibold text-lg">Input</div>
                <div className="flex flex-col gap-2 items-center">
                    <div><InlineMath math="dk" /></div>
                    <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={4} size={12} colorData={spyData?.dk ? Array.from(spyData.dk) : []} showValues={true} />
                </div>
            </div>
            <ArrowLongRightIcon className="size-6" />
            <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                <div className="flex flex-col gap-2 items-center">
                    <div><InlineMath math="dk_{PKE}" /></div>
                    <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={4} size={12} colorData={spyData?.dkPKE ? Array.from(spyData.dkPKE) : []} showValues={true} />
                </div>
            </div>
            <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                <div className="flex flex-col gap-2 items-center">
                    <div><InlineMath math="ek_{PKE}" /></div>
                    <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={4} size={12} colorData={spyData?.ekPKE ? Array.from(spyData.ekPKE) : []} showValues={true} />
                </div>
            </div>
            <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                <div className="flex flex-col gap-2 items-center">
                    <div><InlineMath math="h" /></div>
                    <SquareGrid rows={1} cols={4} size={12} colorData={spyData?.h ? Array.from(spyData.h) : []} showValues={true} />
                </div>
            </div>
            <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                <div className="flex flex-col gap-2 items-center">
                    <div><InlineMath math="z" /></div>
                    <SquareGrid rows={1} cols={4} size={12} colorData={spyData?.z ? Array.from(spyData.z) : []} showValues={true} />
                </div>
            </div>
        </div>
        <ArrowLongDownIcon className="size-6" />
        <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
            <div><InlineMath math="dk_{PKE}, c" /></div>
            <ArrowLongRightIcon className="size-6" />
            <div
                onClick={() => {
                    onSelectVariable("decapsulationBase1");
                    onChangeStage("decapsulation1");
                }}
                className="rounded-lg bg-white p-4 font-mono text-sm flex cursor-pointer items-center justify-center w-64 shadow-sm border-2 border-gray-300"
            >
                Kyber-PKE Decrypt
            </div>
            <ArrowLongRightIcon className="size-6" />
            <div className="flex flex-col gap-2 items-center">
                <div><InlineMath math="m'" /></div>
                <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={8} size={12} colorData={spyData?.m ? Array.from(spyData.m) : []} showValues={true} />
            </div>
        </div>
        <div className="flex flex-row gap-4 items-center">
            <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                <div><InlineMath math="m' \parallel h" /></div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-col gap-2 items-center">
                    <div><InlineMath math="K'" /></div>
                    <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={8} size={12} colorData={spyData?.K ? Array.from(spyData.K) : []} showValues={true} />
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <div><InlineMath math="r'" /></div>
                    <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={8} size={12} colorData={spyData?.r ? Array.from(spyData.r) : []} showValues={true} />
                </div>
            </div>
            <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                <div><InlineMath math="z \parallel c" /></div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-col gap-2 items-center">
                    <div><InlineMath math="\bar{K}" /></div>
                    <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={8} size={12} colorData={spyData?.Kbar ? Array.from(spyData.Kbar) : []} showValues={true} />
                </div>
            </div>
        </div>
        <ArrowLongDownIcon className="size-6" />
        <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
            <div><InlineMath math="ek_{PKE}, m', r'" /></div>
            <ArrowLongRightIcon className="size-6" />
            <div
                className="rounded-lg bg-white p-4 font-mono text-sm flex items-center justify-center w-64 shadow-sm border-2 border-gray-300"
            >
                Kyber-PKE Encrypt
            </div>
            <ArrowLongRightIcon className="size-6" />
            <div className="flex flex-col items-center font-mono text-sm gap-2">
                <div><InlineMath math="c'" /></div>
                <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={8} size={12} colorData={spyData?.c ? Array.from(spyData.c) : []} showValues={true} />
            </div>
        </div>
        <ArrowLongDownIcon className="size-6" />
        <div className="flex flex-col gap-2 items-center justify-center bg-green-100 rounded-xl p-5 w-fit border-2 border-green-300">
            <div className="text-green-700 font-semibold text-lg">Output</div>
            <div className="flex flex-col items-center font-mono text-sm gap-2">
                <div className="font-mono text-sm"><InlineMath math="K'" /></div>
                <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={8} size={12} colorData={spyData?.Kfinal ? Array.from(spyData.Kfinal) : []} showValues={true} />
            </div>
        </div>
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