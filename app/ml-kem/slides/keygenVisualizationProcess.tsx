"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import SquareGrid from "@/components/ui/gridLattice";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { InlineMath } from "react-katex";
import { KeygenSpyData } from '@/utils/createSpy';

export default function KeygenVisualizationProcess({
  onSelectVariable,
  onChangeStage,
  spyData
}: {
  onSelectVariable: (variable: string) => void;
  onChangeStage: (stage: string) => void;
  spyData: KeygenSpyData | null;
}) {

  const [stage, setStage] = useState(0);
  const { d, z, rho, sigma, A, sHat, eHat, tHat, ekPKE, dkPKE, publicKey, secretKey } = spyData ?? {};

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 1000),
      setTimeout(() => setStage(2), 2200),
      setTimeout(() => setStage(3), 3400),
      setTimeout(() => setStage(4), 4600)
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.4
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8 h-full"
    >
      
      <motion.div
        variants={item}
        className="flex flex-row gap-6 font-mono text-sm items-center justify-center"
      >
        <div>
          INPUT <InlineMath math="d \in \mathbb{B}^{32}" />
        </div>

        {stage >= 0 && (
          <motion.div layoutId="seed">
            <SquareGrid rows={1} cols={4} size={12} colorData={spyData?.d ? Array.from(spyData.d) : []} showValues={true} />
          </motion.div>
        )}

        {stage >= 1 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl"
            >
              →
            </motion.div>

            <div className="flex flex-col gap-3 items-center">
              {/* rho */}
              <div className="flex flex-col gap-1 items-center">
                <InlineMath math="\rho" />
                <motion.div layoutId="rho">
                  <SquareGrid rows={1} cols={4} size={12} colorData={spyData?.rho ? Array.from(spyData.rho) : []} showValues={true} />
                </motion.div>
              </div>

              {/* sigma */}
              <div className="flex flex-col gap-1 items-center">
                <div>𝜎</div>
                <motion.div layoutId="sigma">
                  <SquareGrid rows={1} cols={4} size={12} colorData={spyData?.sigma ? Array.from(spyData.sigma) : []} showValues={true} />
                </motion.div>
                {stage >= 2 && (
                  <>
                    {/* left */}
                    <motion.div
                      initial={{ opacity: 1, x: 0, y: 0 }}
                      animate={{ x: -80, y: 80, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="absolute"
                    >
                      <SquareGrid rows={1} cols={4} size={12} color="#8b5cf6" />
                    </motion.div>

                    {/* right */}
                    <motion.div
                      initial={{ opacity: 1, x: 0, y: 0 }}
                      animate={{ x: 80, y: 80, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="absolute"
                    >
                      <SquareGrid rows={1} cols={4} size={12} color="#8b5cf6" />
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </motion.div>

      {stage >= 2 && (
        <motion.div
          variants={item}
          className="flex flex-row gap-6 items-center justify-center h-full"
        >
          <div className="text-4xl">(</div>

          {/* A  */}
          <div className="flex flex-col items-center gap-3">
            <InlineMath math="A" />
            <motion.div
              layoutId="rho"
              onClick={() => onSelectVariable("keygenMatrixA")}
              className="cursor-pointer w-fit h-fit"
            >
              <SquareGrid rows={8} cols={8} size={15} colorData={spyData?.A?.[0]?.[0] ? Array.from(spyData.A[0][0]) : []} showValues={true} />
            </motion.div>
          </div>

          <div className="text-4xl">
            <InlineMath math="\cdot" />
          </div>

          {/* s */}
          <div className="flex flex-col items-center gap-3">
            <InlineMath math="s" />

            <motion.div
              layoutId="sigma"
              transition={{ duration: 0.6 }}
              onClick={() => onSelectVariable("keygenMatrixS")}
              className="cursor-pointer w-fit h-fit"
            >
              <SquareGrid rows={8} cols={1} size={15} colorData={spyData?.sHat[0] ? Array.from(spyData.sHat[0]) : []} showValues={true} />
            </motion.div>
          </div>

          <div className="text-4xl">)</div>
          <div className="text-4xl">+</div>

          {/* e */}
          <div className="flex flex-col items-center gap-3">
            <InlineMath math="e" />

            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: -40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onClick={() => onSelectVariable("keygenMatrixE")}
              className="cursor-pointer w-fit h-fit"
            >
              <SquareGrid rows={8} cols={1} size={15} colorData={spyData?.eHat[0] ? Array.from(spyData.eHat[0]) : []} showValues={true} />
            </motion.div>
          </div>

          <div className="text-4xl">=</div>

          {/* t */}
          {stage >= 3 && (
            <div className="flex flex-col items-center gap-3">
              <InlineMath math="t" />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => onSelectVariable("keygenMatrixT")}
                className="cursor-pointer w-fit h-fit"
              >
                <SquareGrid rows={8} cols={1} size={15} colorData={spyData?.tHat[0] ? Array.from(spyData.tHat[0]) : []} showValues={true} />
              </motion.div>
            </div>
          )}
        </motion.div>
      )}

      {stage >= 4 && (
        <motion.div
          variants={item}
          className="flex flex-row gap-16 justify-center"
        >
          {/* ek actually maybe just make this one grid*/}
          <div className="flex flex-col items-center font-mono text-sm gap-4">
            <div className="flex flex-row gap-2 items-center">
              {/* t */}
              <SquareGrid rows={8} cols={1} size={16} colorData={spyData?.ekPKE ? Array.from(spyData.ekPKE) : []} showValues={true} />

              {/* rho */}
              <motion.div layoutId="rho">
                <SquareGrid rows={4} cols={1} size={16} colorData={spyData?.rho ? Array.from(spyData.rho) : []} showValues={true} />
              </motion.div>
            </div>
            <InlineMath math="ek_{PKE}" />
          </div>

          {/* dk */}
          <div className="flex flex-col items-center font-mono text-sm gap-4">
            <SquareGrid rows={8} cols={1} size={16} colorData={spyData?.dkPKE ? Array.from(spyData.dkPKE) : []} showValues={true}/>
            <InlineMath math="dk_{PKE}" />
          </div>
        </motion.div>
      )}

      <div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onChangeStage("keygen0")}
        >
          <ChevronLeftIcon className="size-6" /> BACK
        </Button>
      </div>
    </motion.div>
  );
}