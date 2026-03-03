'use client';

import React, { useState, useRef, useEffect } from 'react';
import * as pqc from 'pqc';
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MLKEMPage() {
    const [securityLevel, setSecurityLevel] = useState("ml_kem768");
    const [aliceKeys, setAliceKeys] = useState<any>(null);
    const [cipherText, setCipherText] = useState<any>(null);
    const [bobShared, setBobShared] = useState<any>(null);
    const [output, setOutput] = useState<string[]>([]);

    const addOutput = (message: string) => {
        setOutput(prev => [...prev, message]);
    };

    useEffect(() => {
        setAliceKeys(null);
        setCipherText(null);
        setBobShared(null);
        setOutput(["Security level changed."]);
    }, [securityLevel]);

    const mlKemLevels = [
        { label: 'ML-KEM-512 (128-bit security)', value: 'ml_kem512' },
        { label: 'ML-KEM-768 (192-bit security)', value: 'ml_kem768' },
        { label: 'ML-KEM-1024 (256-bit security)', value: 'ml_kem1024' }
    ];

    const operations = [
        'Key Generation',
        'Encapsulation',
        'Decapsulation',
        'Complete KEM Flow'
    ];

    const executeMLKEM = async (operation: string) => {
        const kem = pqc.ml_kem[securityLevel];

        switch(operation) {
            case "Key Generation": {
                const keys = kem.keygen();
                setAliceKeys(keys);
                setCipherText(null);
                setBobShared(null);
                addOutput("Key pair generated.");
                addOutput(`Public key length: ${keys.publicKey.length} bytes`);
                addOutput(`Secret key length: ${keys.secretKey.length} bytes`);
                break;
            }

            case "Encapsulation": {
                if (!aliceKeys) {
                    console.log("Generate keys first!");
                    return;
                }

                const result = kem.encapsulate(aliceKeys.publicKey);
                setCipherText(result.cipherText);
                setBobShared(result.sharedSecret);
                addOutput("Encapsulation complete.");
                addOutput(`Ciphertext length: ${result.cipherText.length} bytes`);
                }
                break;

            case "Decapsulation": {
                if (!aliceKeys || !cipherText) {
                    console.log("Need keys and ciphertext first!");
                    return;
                }

                const aliceShared = kem.decapsulate(
                    cipherText,
                    aliceKeys.secretKey
                );

                const match =
                    Buffer.from(aliceShared).toString("hex") ===
                    Buffer.from(bobShared).toString("hex");

                addOutput("Decapsulation complete.");
                addOutput(`Secrets match: ${match ? "YES" : "NO"}`);  
                break;
            }
        }

        if (operation === "Complete KEM Flow") {
            const keys = kem.keygen();
            const result = kem.encapsulate(keys.publicKey);
            const aliceShared = kem.decapsulate(
                result.cipherText,
                keys.secretKey
            );

            console.log(
                "Secrets Match:",
                Buffer.from(aliceShared).toString("hex") ===
                Buffer.from(result.sharedSecret).toString("hex")
            );
        }
    };

    return (
        <div className="grid min-h-screen grid-cols-1 md:grid-cols-[2.5fr_1.5fr] gap-6 bg-zinc-200 p-6 dark:bg-black">
            <main className="rounded-2xl bg-white dark:bg-zinc-900 shadow-xl p-10">

            </main>
            <div className="p-6 sticky top-6 h-[calc(100vh-3rem)] overflow-y-auto flex flex-col gap-4">
                <div className="rounded-2xl bg-zinc-900 text-green-400 font-mono text-xs shadow-xl p-6 h-48 overflow-y-auto">
                    {output.length === 0 ? (
                        <div className="text-zinc-500">Output will appear here...</div>
                    ) : (
                        output.map((line, index) => (
                            <div key={index}>{line}</div>
                        ))
                    )}
                </div>
                <div className="overflow-y-auto flex flex-col gap-4 pr-2">
                    <div className="flex flex-col items-center gap-4 rounded-2xl bg-white dark:bg-zinc-900 font-mono text-sm shadow-xl p-10 overflow-y-auto">
                        Select Security Level
                        <Select value={securityLevel} onValueChange={setSecurityLevel}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Security Level" />
                            </SelectTrigger>
                            <SelectContent>
                                {mlKemLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                    {level.label}
                                </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 font-mono text-sm shadow-xl p-10 overflow-y-auto">
                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={() => executeMLKEM("Key Generation")}
                        >
                            Key Generation
                        </Button>
                    </div>
                    <div className="flex items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 font-mono text-sm shadow-xl p-10 overflow-y-auto">
                        <Button
                            variant="secondary"
                            size="lg"
                            disabled={!aliceKeys}
                            onClick={() => executeMLKEM("Encapsulation")}
                        >
                            Encapusulation
                        </Button>
                    </div>
                    <div className="flex items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 font-mono text-sm shadow-xl p-10 overflow-y-auto">
                        <Button
                            variant="secondary"
                            size="lg"
                            disabled={!cipherText}
                            onClick={() => executeMLKEM("Decapsulation")}
                        >
                            Decapsulation
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}