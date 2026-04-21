"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SquareGrid from "@/components/ui/gridLattice";
import { ChevronLeftIcon, ArrowLongRightIcon, PlusIcon, EqualsIcon } from "@heroicons/react/24/solid";
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
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 800),
      setTimeout(() => setStage(2), 1800),
      setTimeout(() => setStage(3), 2800),
      setTimeout(() => setStage(4), 3800),
      setTimeout(() => setStage(5), 4800)
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-row gap-6 justify-center">

        {/* ek */}
        <div className="flex flex-row gap-3 items-center">
          <div className="flex flex-col items-center">
            <div>Encapsulation Key ek</div>
            <motion.div layoutId="ek">
              <SquareGrid rows={1} cols={4} size={12} colorData={spyData?.ek ? Array.from(spyData.ek) : []} showValues />
            </motion.div>
          </div>

          {stage >= 1 && (
            <>
              <ArrowLongRightIcon className="size-6" />

              {/* rho */}
              <div className="flex flex-col items-center">
                <InlineMath math="\rho" />
                <motion.div layoutId="rho">
                  <SquareGrid rows={1} cols={4} size={12} colorData={spyData?.rho ? Array.from(spyData.rho) : []} showValues />
                </motion.div>
              </div>

              {/* t */}
              <div className="flex flex-col items-center">
                <InlineMath math="t" />
                <motion.div layoutId="ek">
                  <SquareGrid rows={1} cols={4} size={12} colorData={spyData?.tHat[0] ? Array.from(spyData.tHat[0]) : []} showValues base={3329} />
                </motion.div>
              </div>
            </>
          )}
        </div>

        {/* m */}
        <div className="flex flex-col items-center">
          <div>Message <InlineMath math="m" /></div>
          <motion.div layoutId="m">
            <SquareGrid rows={1} cols={4} size={12} colorData={spyData?.m ? Array.from(spyData.m) : []} showValues />
          </motion.div>
        </div>

        {/* r */}
        <div className="flex flex-col items-center">
          <div>Randomness <InlineMath math="r" /></div>
          <motion.div layoutId="r">
            <SquareGrid rows={1} cols={4} size={12} colorData={spyData?.r ? Array.from(spyData.r) : []} showValues />
          </motion.div>
        </div>
      </div>

      {stage >= 2 && (
        <div className="flex flex-row gap-6 items-center justify-center">

          {/* A */}
          <div className="flex flex-col items-center gap-3">
            <InlineMath math="\hat{A}" />
            <motion.div
              layoutId="rho"
              onClick={() => onSelectVariable("encapsMatrixAT")}
              className="cursor-pointer"
            >
              <SquareGrid rows={8} cols={8} size={15} colorData={spyData?.A?.[0]?.[0] ? Array.from(spyData.A[0][0]) : []} showValues base={3329} />
            </motion.div>
          </div>

          <InlineMath math="\cdot" />

          {/* y */}
          <div className="flex flex-col items-center gap-3">
            <InlineMath math="y" />
            <motion.div
              layoutId="r"
              onClick={() => onSelectVariable("encapsMatrixY")}
              className="cursor-pointer"
            >
              <SquareGrid rows={8} cols={1} size={15} colorData={spyData?.A?.[0]?.[0] ? Array.from(spyData.A[0][0]) : []} showValues base={3329} />
            </motion.div>
          </div>

          <div>+</div>

          {/* e1 */}
          <motion.div
            onClick={() => onSelectVariable("encapsMatrixE1")}
            className="cursor-pointer flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <InlineMath math="e_1" />
            <SquareGrid rows={8} cols={1} size={15} colorData={spyData?.e1[0] ? Array.from(spyData.e1[0]) : []} showValues base={3329} />
          </motion.div>

          <div>=</div>

          {/* u */}
          {stage >= 3 && (
            <div className="flex flex-col items-center gap-3">
              <InlineMath math="u" />
              <motion.div
                layoutId="u"
                onClick={() => onSelectVariable("encapsMatrixU")}
                className="cursor-pointer"
              >
                <SquareGrid rows={8} cols={1} size={15} colorData={spyData?.u[0] ? Array.from(spyData.u[0]) : []} showValues base={3329} />
              </motion.div>
            </div>
          )}
        </div>
      )}

      {stage >= 3 && (
        <div className="flex flex-row gap-6 items-center justify-center">

          {/* t */}
          <div className="flex flex-col items-center gap-3">
            <InlineMath math="t" />
            <motion.div
              layoutId="ek"
              onClick={() => onSelectVariable("encapsMatrixT")}
              className="cursor-pointer"
            >
              <SquareGrid rows={8} cols={1} size={15} colorData={spyData?.tHat[0] ? Array.from(spyData.tHat[0]) : []} showValues base={3329} />
            </motion.div>
          </div>

          <InlineMath math="\cdot" />

          {/* y */}
          <div className="flex flex-col items-center gap-3">
            <InlineMath math="y" />
            <motion.div
              layoutId="r"
              onClick={() => onSelectVariable("encapsMatrixY")}
              className="cursor-pointer"
            >
              <SquareGrid rows={8} cols={1} size={15} colorData={spyData?.y[0] ? Array.from(spyData.y[0]) : []} showValues base={3329} />
            </motion.div>
          </div>

          <div>+</div>

          {/* e2 */}
          <motion.div
            onClick={() => onSelectVariable("encapsMatrixE2")}
            className="cursor-pointer flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <InlineMath math="e_2" />
            <SquareGrid rows={8} cols={1} size={15} colorData={spyData?.e2 ? Array.from(spyData.e2) : []} showValues base={3329} />
          </motion.div>

          <div>+</div>

          {/* mu */}
          <div className="flex flex-col items-center gap-3">
            <InlineMath math="\mu" />
            <motion.div
              layoutId="m"
              onClick={() => onSelectVariable("encapsMatrixMu")}
              className="cursor-pointer"
            >
              <SquareGrid rows={8} cols={1} size={15} colorData={spyData?.mu ? Array.from(spyData.mu) : []} showValues base={3329} />
            </motion.div>
          </div>

          <div>=</div>

          {/* v */}
          <div className="flex flex-col items-center gap-3">
            <InlineMath math="v" />
            <motion.div
              layoutId="v"
              onClick={() => onSelectVariable("encapsMatrixV")}
              className="cursor-pointer"
            >
              <SquareGrid rows={8} cols={1} size={15} colorData={spyData?.v ? Array.from(spyData.v) : []} showValues base={3329} />
            </motion.div>
          </div>
        </div>
      )}

      {stage >= 5 && (
        <div className="flex flex-col gap-4 items-center">
          <div className="flex flex-row gap-2">

            {/* u → c1 */}
            <motion.div
              layoutId="u"
              onClick={() => onSelectVariable("returnCiphertext")}
              className="cursor-pointer"
            >
              <SquareGrid rows={4} cols={1} size={15} colorData={spyData?.c1 ? Array.from(spyData.c1) : []} showValues={true} />
            </motion.div>

            {/* v → c2 */}
            <motion.div
              layoutId="v"
              onClick={() => onSelectVariable("returnCiphertext")}
              className="cursor-pointer"
            >
              <SquareGrid rows={4} cols={1} size={15} colorData={spyData?.c2 ? Array.from(spyData.c2) : []} showValues={true} />
            </motion.div>

          </div>
          <InlineMath math="c" />
        </div>
      )}

      <Button
          variant="secondary"
          size="sm"
          onClick={() => onChangeStage("encapsulation0")}
          className="flex justify-start cursor-pointer"
          >
          <ChevronLeftIcon className="size-6" /> BACK
      </Button>
    </div>
  );
}