'use client';

import React, { useState, useRef, useEffect } from 'react';
import * as pqc from 'pqc';
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MLDSAPage() {
    const [securityLevel, setSecurityLevel] = useState("ml_dsa65");
    const [output, setOutput] = useState<string[]>([]);
    const [keys, setKeys] = useState<any>(null);
    const [signature, setSignature] = useState<Uint8Array | null>(null);
    const [message] = useState("defaultmessage:D");
    
    const addOutput = (message: string) => {
        setOutput(prev => [...prev, message]);
    };

    useEffect(() => {
        setKeys(null);
        setSignature(null);
        setOutput(["Security level changed."]);
    }, [securityLevel]);

    const mlDsaLevels = [
        { label: 'ML-DSA-44 (128-bit security)', value: 'ml_dsa44' },
        { label: 'ML-DSA-65 (192-bit security)', value: 'ml_dsa65' },
        { label: 'ML-DSA-87 (256-bit security)', value: 'ml_dsa87' }
    ];

    const operations = [
        'Key Generation',
        'Sign Message',
        'Verify Signature',
        'Complete DSA Flow'
    ];
    
    const executeMLDSA = async (operation: string) => {
        const algorithm = pqc.ml_dsa[securityLevel];
        const msg = pqc.utils.utf8ToBytes(message);

        switch (operation) {
            case "Key Generation": {
            const newKeys = algorithm.keygen();

            setKeys(newKeys);
            setSignature(null);

            addOutput(" Key pair generated");
            addOutput(`Public Key length: ${newKeys.publicKey.length}`);
            addOutput(`Secret Key length: ${newKeys.secretKey.length}`);
            break;
            }

            case "Sign Message": {
                if (!keys) {
                    console.log("Generate keys first.");
                    return;
                }

                const sig = algorithm.sign(keys.secretKey, msg);
                setSignature(sig);

                addOutput("Message signed");
                addOutput(`Signature length: ${sig.length}`);
                break;
            }

            case "Verify Signature": {
                if (!keys || !signature) {
                    console.log("Need keys and signature first.");
                    return;
                }

                const isValid = algorithm.verify(
                    keys.publicKey,
                    msg,
                    signature
                );

                addOutput(`Signature valid: ${isValid}`);
                break;
            }

            default: {
                addOutput("Unknown operation");
            }
        }
    }
    

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
                                {mlDsaLevels.map((level) => (
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
                            onClick={() => executeMLDSA("Key Generation")}
                        >
                            Key Generation
                        </Button>
                    </div>
                    <div className="flex items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 font-mono text-sm shadow-xl p-10 overflow-y-auto">
                        <Button
                            variant="secondary"
                            size="lg"
                            disabled={!keys}
                            onClick={() => executeMLDSA("Sign Message")}
                        >
                            Sign
                        </Button>
                    </div>
                    <div className="flex items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 font-mono text-sm shadow-xl p-10 overflow-y-auto">
                        <Button
                            variant="secondary"
                            size="lg"
                            disabled={!signature}
                            onClick={() => executeMLDSA("Verify Signature")}
                        >
                            Verify Signature
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}