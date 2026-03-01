'use client';

import React, { useState, useRef, useEffect } from 'react';
import * as pqc from 'pqc';
import Link from "next/link";
import { Button } from "@/components/ui/button"

export default function MLDSAPage() {
        const executeMLDSA = async (securityLevel: string) => {
            const keys = pqc.ml_dsa.ml_dsa65.keygen();

            const msg = pqc.utils.utf8ToBytes('Post Quantum Cryptography');
            const sig = pqc.ml_dsa.ml_dsa65.sign(keys.secretKey, msg);

            const isValid = pqc.ml_dsa.ml_dsa65.verify(keys.publicKey, msg, sig);
            console.log('Signature valid:', isValid);
        }

    return (
        <div className="grid min-h-screen grid-cols-1 md:grid-cols-[3fr_1fr] gap-6 bg-zinc-200 p-6 dark:bg-black">
                    <main className="rounded-2xl bg-white dark:bg-zinc-900 shadow-xl p-10">
        
                    </main>
                    <div className="rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-xl sticky top-6 flex items-center justify-center">
                        <div className="bg-secondary-800 p-3 rounded-lg font-mono text-sm h-[600px] overflow-y-auto">
                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={() => executeMLDSA("65")}
                        >
                            TEST ML-DSA
                        </Button>
                        </div>
                    </div>
                </div>
    );
}