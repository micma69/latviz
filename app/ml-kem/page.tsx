'use client';

import React, { useState, useEffect } from 'react';
import * as pqc from '@/lib/modified-pqc/ml-kem-modified';
import Link from "next/link";
import { InlineMath } from 'react-katex';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import KeygenVisualization from './slides/keygenOuter';
import KeygenVisualizationProcess from './slides/keygenInner';
import EncapsulationVisualization from './slides/encapsOuter';
import EncapsulationVisualizationProcess from './slides/encapsInner';
import DecapsulationVisualization from './slides/decapsOuter';
import DecapsulationVisualizationProcess from './slides/decapsInner';
import { KeygenSpyData, EncapsSpyData, DecapsSpyData, createSpy } from '@/utils/createSpy';
import SquareGrid from "@/components/ui/gridLattice";

export default function MLKEMPage() {
    const [vizStage, setVizStage] = useState<string | null>(null);
    const [selectedVariable, setSelectedVariable] = useState<string | null>(null);
    const [securityLevel, setSecurityLevel] = useState<KemSecurityLevel>('ml_kem512');
    const [selectedParam, setSelectedParam] = useState<KemParamKey>('k');
    const [aliceKeys, setAliceKeys] = useState<{ publicKey: Uint8Array; secretKey: Uint8Array } | null>(null);
    const [cipherText, setCipherText] = useState<Uint8Array | null>(null);
    const [sharedSecret, setsharedSecret] = useState<Uint8Array | null>(null);
    const [decapsulatedSecret, setDecapsulatedSecret] = useState<Uint8Array | null>(null);

    const [flow, setFlow] = useState<Record<string, unknown> | null>(null);
    const [animationStep, setAnimationStep] = useState(0);
    const [animationComplete, setAnimationComplete] = useState(false);

    const [keygenSpyData, setKeygenSpyData] = useState<KeygenSpyData | null>(null);
    const [encapsSpyData, setEncapsSpyData] = useState<EncapsSpyData | null>(null);
    const [decapsSpyData, setDecapsSpyData] = useState<DecapsSpyData | null>(null);

    useEffect(() => {
        setAliceKeys(null);
        setCipherText(null);
        setsharedSecret(null);
        setVizStage(null);
        setSelectedVariable(null);
        setKeygenSpyData(null);
        setEncapsSpyData(null);
        setDecapsSpyData(null);
    }, [securityLevel]);

    const resetAll = (): void => {
        setAliceKeys(null);
        setCipherText(null);
        setsharedSecret(null);;
        setSelectedVariable(null);
        setKeygenSpyData(null);
        setEncapsSpyData(null);
        setDecapsSpyData(null);
    }

    const mlKemLevels = [
        { label: 'ML-KEM-512 (128-bit security)', value: 'ml_kem512' },
        { label: 'ML-KEM-768 (192-bit security)', value: 'ml_kem768' },
        { label: 'ML-KEM-1024 (256-bit security)', value: 'ml_kem1024' }
    ];

    const mlKemParams = {
        ml_kem512: { n: 256, q: 3329, k: 2, eta1: 3, eta2: 2, du: 10, dv: 4 },
        ml_kem768: { n: 256, q: 3329, k: 3, eta1: 2, eta2: 2, du: 10, dv: 4 },
        ml_kem1024: { n: 256, q: 3329, k: 4, eta1: 2, eta2: 2, du: 11, dv: 5 },
    } as const;

    type KemSecurityLevel = keyof typeof mlKemParams;
    type KemParamKey = keyof typeof mlKemParams.ml_kem512;

    const currentParams = mlKemParams[securityLevel];
    const currentParamValue = currentParams?.[selectedParam];

    const parameters = [
        { key: "n", label: "n" },
        { key: "q", label: "q" },
        { key: "k", label: "k" },
        { key: "eta1", label: "η₁" },
        { key: "eta2", label: "η₂" },
        { key: "du", label: "dᵤ" },
        { key: "dv", label: "dᵥ" },
    ];

    const executeMLKEM = async (operation: string) => {
        const spy = createSpy();
        const kem = pqc.ml_kem[securityLevel as keyof typeof pqc.ml_kem](spy);

        spy.subscribe((stage, state) => {
        if (stage === 'keygen') setKeygenSpyData({ ...state.keygen } as KeygenSpyData);
        if (stage === 'encaps') setEncapsSpyData({ ...state.encaps } as EncapsSpyData);
        if (stage === 'decaps') setDecapsSpyData({ ...state.decaps } as DecapsSpyData);
    });

        switch (operation) {
            case "Key Generation": {
                const keys = kem.keygen();
                setAliceKeys(keys);
                setCipherText(null);
                setsharedSecret(null);
                setKeygenSpyData(prev => prev ? {
                    ...prev,
                    publicKey: Array.from(keys.publicKey),
                    secretKey: Array.from(keys.secretKey),
                } : null);
                break;
            }

            case "Encapsulation": {
                if (!aliceKeys) {
                    console.log("Generate keys first!");
                    return;
                }

                const result = kem.encapsulate(aliceKeys.publicKey);
                setCipherText(result.cipherText);
                setsharedSecret(result.sharedSecret);
                setEncapsSpyData(prev => prev ? {
                    ...prev,
                    cipherText: Array.from(result.cipherText),
                    sharedSecret: Array.from(result.sharedSecret),
                } : null);
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

                setDecapsulatedSecret(aliceShared);

                const match = sharedSecret
                    ? Buffer.from(aliceShared).toString("hex") === Buffer.from(sharedSecret).toString("hex")
                    : false;

                break;
            }

            case "Complete Flow": {
                const keys = kem.keygen();
                const { cipherText, sharedSecret: bobSecret } = kem.encapsulate(keys.publicKey);
                const aliceSecret = kem.decapsulate(cipherText, keys.secretKey);
                const secretsMatch = Buffer.compare(aliceSecret, bobSecret) === 0;

                const publicKeyArr = Array.from(keys.publicKey);
                const secretKeyArr = Array.from(keys.secretKey);
                const cipherTextArr = Array.from(cipherText);
                const bobSecretArr = Array.from(bobSecret);
                const aliceSecretArr = Array.from(aliceSecret);

                setFlow({
                    alicePublicKey: publicKeyArr.slice(0, 10),
                    alicePrivateKey: secretKeyArr.slice(0, 10),
                    bobSharedSecret: bobSecretArr.slice(0, 10),
                    cipherText: cipherTextArr.slice(0, 10),
                    aliceSharedSecret: aliceSecretArr.slice(0, 10),
                    secretsMatch: secretsMatch
                });

                return {
                    secretsMatch,
                    keyGeneration: {
                    publicKey: publicKeyArr,
                    secretKey: secretKeyArr,
                    publicKeySize: keys.publicKey.length,
                    secretKeySize: keys.secretKey.length,
                    },
                    encapsulation: {
                    cipherText: cipherTextArr,
                    sharedSecret: bobSecretArr,
                    cipherTextSize: cipherText.length,
                    sharedSecretSize: bobSecret.length,
                    },
                    decapsulation: {
                    sharedSecret: aliceSecretArr,
                    secretsMatch,
                    },
                };
            }
        }
    };

    useEffect(() => {
        if (flow) {
        setAnimationStep(0);
        setAnimationComplete(false);
        // Start animation sequence
        const timer = setTimeout(() => {
            animateSequence();
            }, 500);
            return () => clearTimeout(timer);
            }
    }, [flow]);

    const animateSequence = () => {
    const totalSteps = 4; // Total animation steps
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      setAnimationStep(currentStep);
      
      if (currentStep >= totalSteps) {
        clearInterval(interval);
        setAnimationComplete(true);
      }
    }, 1200); // Advance animation every 1.2 seconds

    return () => clearInterval(interval);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 pb-8 border-b border-slate-700 text-slate-400 text-sm">
                    <Link href="/" className="text-blue-400 hover:text-blue-300">
                        ← Back
                    </Link>
                </div>
                {/* prolly add explalations here later */}
                <div className="rounded-xl bg-slate-800 p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-white">Key Exchange Flow Visualization</h2>
                    {flow && (
                    <section className="mb-12">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                        <div className="flex flex-col md:flex-row items-center justify-center mb-8">
                        {/* Flow diagram */}
                        <div className="flex flex-col md:flex-row items-center justify-center w-full">
                            {/* Alice Side */}
                            <div className="w-full md:w-5/12 p-4">
                            <div className={`bg-blue-50 rounded-xl border border-blue-200 p-6 transition-all duration-500 
                                ${animationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                <div className="flex items-center mb-4">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                    <svg className="h-6 w-6 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-blue-900">Alice</h3>
                                </div>
                                
                                <div className="space-y-4">
                                <div className={`bg-white rounded-lg p-4 border border-blue-100 transition-all duration-500 
                                    ${animationStep >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                    <p className="text-sm font-medium text-blue-800 mb-2">1. Generates Key Pair</p>
                                    <div className="text-xs space-y-1 text-secondary-800">
                                    <p><strong>Encapsulation Key:</strong> {Array.isArray(flow.alicePublicKey) ? 
                                        `[${flow.alicePublicKey.join(', ')}${flow.alicePublicKey.length < 10 ? '' : '...'}]` : 
                                        flow.alicePublicKey as React.ReactNode}</p>
                                    <p><strong>Decapsulation Key:</strong> {Array.isArray(flow.alicePrivateKey) ? 
                                        `[${flow.alicePrivateKey.join(', ')}${flow.alicePrivateKey.length < 10 ? '' : '...'}]` :  
                                        flow.alicePrivateKey as React.ReactNode}</p>
                                    </div>
                                </div>
                                
                                <div className={`bg-white rounded-lg p-4 border border-blue-100 transition-all duration-500 delay-700
                                    ${animationStep >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                    <p className="text-sm font-medium text-blue-800 mb-2">4. Decapsulates Shared Secret</p>
                                    <div className="text-xs space-y-1 text-secondary-800">
                                    <p><strong>Shared Secret:</strong> {Array.isArray(flow.aliceSharedSecret) ? 
                                        `[${flow.aliceSharedSecret.join(', ')}${flow.aliceSharedSecret.length < 10 ? '' : '...'}]` : 
                                        flow.aliceSharedSecret as React.ReactNode}</p>
                                    {animationComplete && (flow.secretsMatch as boolean) && (
                                        <p className="mt-2 text-green-600 font-semibold">✓ Matches Bob&apos;s secret</p>
                                    )}
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                            
                            {/* Middle Arrows */}
                            <div className="w-full md:w-2/12 py-4 flex flex-col items-center justify-center">
                            <div className={`hidden md:block w-full h-0.5 bg-secondary-200 my-2 transition-all duration-700 
                                ${animationStep >= 2 ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}></div>
                            <div className="md:hidden h-20 w-0.5 bg-secondary-200 my-2"></div>
                            
                            <div className={`bg-white rounded-full p-3 shadow-md transition-all duration-700 
                                ${animationStep >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                            </div>
                            
                            <div className={`hidden md:block w-full h-0.5 bg-secondary-200 my-2 transition-all duration-700 
                                ${animationStep >= 3 ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}></div>
                            <div className="md:hidden h-20 w-0.5 bg-secondary-200 my-2"></div>
                            </div>
                            
                            {/* Bob Side */}
                            <div className="w-full md:w-5/12 p-4">
                            <div className={`bg-green-50 rounded-xl border border-green-200 p-6 transition-all duration-500 
                                ${animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                <div className="flex items-center mb-4">
                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                    <svg className="h-6 w-6 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-green-900">Bob</h3>
                                </div>
                                
                                <div className="space-y-4">
                                <div className={`bg-white rounded-lg p-4 border border-green-100 transition-all duration-500 
                                    ${animationStep >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                    <p className="text-sm font-medium text-green-800 mb-2">2. Receives Alice&apos;s Encapsulation Key</p>
                                    <div className="text-xs space-y-1 text-secondary-800">
                                        From encapsulation key, extract the encryption key. Encrypt plaintext into ciphertext, generate shared secret key from encapsulation key.
                                    </div>
                                </div>
                                
                                <div className={`bg-white rounded-lg p-4 border border-green-100 transition-all duration-500 
                                    ${animationStep >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                    <p className="text-sm font-medium text-green-800 mb-2">3. Encapsulates Shared Secret</p>
                                    <div className="text-xs space-y-1 text-secondary-800">
                                    <p><strong>Ciphertext:</strong> {Array.isArray(flow.cipherText) ? 
                                        `[${flow.cipherText.join(', ')}${flow.cipherText.length < 10 ? '' : '...'}]` : 
                                        flow.cipherText as React.ReactNode}</p>
                                    <p><strong>Shared Secret:</strong> {Array.isArray(flow.bobSharedSecret) ? 
                                        `[${flow.bobSharedSecret.join(', ')}${flow.bobSharedSecret.length < 10 ? '' : '...'}]` : 
                                        flow.bobSharedSecret as React.ReactNode}</p>
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                        
                        <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 transition-all duration-700 
                        ${animationComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                        <div className="flex items-start">
                            <svg className="h-6 w-6 mr-2 text-yellow-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                            <p className="font-semibold text-yellow-800 mb-1">Security Note:</p>
                            <p className="text-sm text-yellow-700">
                                During an actual key exchange, only the public key and ciphertext would be transmitted across 
                                the network. The shared secret and private key remain confidential to each party.
                            </p>
                            </div>
                        </div>
                        </div>
                    </div>
                    </section>
                    )}
                        {/*<div className="rounded-xl">
                            <p className="font-semibold text-yellow-800 mb-1"> Extra Notes:</p>
                            <p className="text-sm text-yellow-700">
                                During an actual key exchange, only the public key and ciphertext would be transmitted across the network. The shared secret and private key remain confidential to each party.</p>
                        </div>*/}
                        <div className="flex justify-center">
                            <Button
                                variant="secondary"
                                size="lg"
                                // /onClick={() => executeMLKEM("Complete Flow")}
                            >
                                WORK IN PROGRESS
                            </Button>
                        </div>
                </div>
                <div className="rounded-xl bg-slate-800 p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-white">ML-KEM Full Visualization</h2>
                    <div className="grid grid-cols-1 md:grid-cols-[2.5fr_1.5fr] gap-6">
                        <div className="flex flex-col gap-4">
                            <main className="flex-1 rounded-xl bg-white dark:bg-zinc-900 shadow-xl p-5 min-h-[620.65px]">
                                <div className="flex rounded-xl bg-slate-100 dark:bg-zinc-900 p-5 h-full items-center justify-center">
                                    {(vizStage === null || vizStage === "home") && (
                                        <div className="flex flex-col gap-12 items-center justify-center">
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                onClick={() => {if (!keygenSpyData) {executeMLKEM("Key Generation");} setVizStage("keygen0");}}
                                                className="cursor-pointer h-14 px-10 text-lg"
                                            >
                                                Key Generation
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                disabled={!aliceKeys}
                                                onClick={() => {if (!encapsSpyData) {executeMLKEM("Encapsulation");} setVizStage("encapsulation0");}}
                                                className="cursor-pointer h-14 px-10 text-lg"
                                            >
                                                Encapsulation
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                disabled={!cipherText}
                                                onClick={() => {if (!decapsSpyData) {executeMLKEM("Decapsulation");} setVizStage("decapsulation0");}}
                                                className="cursor-pointer h-14 px-10 text-lg"
                                            >
                                                Decapsulation
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                disabled={!keygenSpyData}
                                                onClick={() => {resetAll()}}
                                                className="cursor-pointer h-14 px-10 text-lg"
                                            >
                                                Reset
                                            </Button>
                                        </div>
                                    )}
                                    {vizStage === "keygen0" && <KeygenVisualization onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} spyData={keygenSpyData} />}
                                    {vizStage === "keygen1" && <KeygenVisualizationProcess onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} spyData={keygenSpyData} />}
                                    {vizStage === "encapsulation0" && <EncapsulationVisualization onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} spyData={encapsSpyData} />}
                                    {vizStage === "encapsulation1" && <EncapsulationVisualizationProcess onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} spyData={encapsSpyData} />}
                                    {vizStage === "decapsulation0" && <DecapsulationVisualization onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} spyData={decapsSpyData} />}
                                    {vizStage === "decapsulation1" && <DecapsulationVisualizationProcess onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} spyData={decapsSpyData} />}
                                </div>
                            </main>
                        </div>
                        <div className="relative">
                            <div className="sticky top-4 flex flex-col gap-4 h-[calc(100vh-3rem)]">
                                <div className="flex flex-col items-center rounded-xl bg-white gap-4 dark:bg-zinc-900 text-sm shadow-xl p-5">
                                    Select Security Level
                                    <Select value={securityLevel} onValueChange={setSecurityLevel as (value: string) => void}>
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
                                    {/* Clickable parameter row */}
                                    <div className="flex flex-wrap justify-center gap-2 w-full">
                                    {parameters.map((param) => (
                                        <button
                                        key={param.key}
                                        onClick={() => setSelectedParam(param.key as KemParamKey)}
                                        className={`
                                            px-2.5 py-1 rounded-md text-xs font-mono transition-all
                                            ${selectedParam === param.key 
                                            ? "bg-blue-600 text-white shadow-sm" 
                                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                            }
                                        `}
                                        >
                                        {param.label}
                                        </button>
                                    ))}
                                    </div>

                                    {/* Value panel - shows current param value */}
                                    {currentParams && (
                                    <div className="w-full mt-1 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-center">
                                        <div className="text-xl font-mono font-bold">
                                        {currentParamValue}
                                        </div>
                                    </div>
                                    )}
                                </div>
                                <div className="flex rounded-xl bg-slate-100 dark:bg-zinc-900 h-full items-center justify-center p-2">
                                    {(vizStage === null || selectedVariable === null) &&
                                        <div>Click a variable to see it in full!</div>
                                    }

                                    {/* ── KEYGEN ── */}
                                    {selectedVariable === "d" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="d \in \mathbb{B}^{32}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((keygenSpyData?.d?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.d ? Array.from(keygenSpyData.d) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "z_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="z \in \mathbb{B}^{32}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((keygenSpyData?.z?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.z ? Array.from(keygenSpyData.z) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "rho_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\rho \in \mathbb{B}^{32}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((keygenSpyData?.rho?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.rho ? Array.from(keygenSpyData.rho) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "sigma_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\sigma \in \mathbb{B}^{32}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((keygenSpyData?.sigma?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.sigma ? Array.from(keygenSpyData.sigma) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "A_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="A \in \mathbb{Z}_q^{k \times k}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil(keygenSpyData?.A?.[0]?.[0].length ?? 0) / 4} cols={4} size={20} colorData={keygenSpyData?.A?.[0]?.[0] ? Array.from(keygenSpyData.A[0][0]) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "s_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="s \in \mathbb{Z}_q^{k}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((keygenSpyData?.sHat[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.sHat[0] ? Array.from(keygenSpyData.sHat[0]) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "e_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="e \in \mathbb{Z}_q^{k}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((keygenSpyData?.eHat[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.eHat[0] ? Array.from(keygenSpyData.eHat[0]) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "t_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="t \in \mathbb{Z}_q^{k}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((keygenSpyData?.tHat[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.tHat[0] ? Array.from(keygenSpyData.tHat[0]) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "ekPKE_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="ek_{PKE} \in \mathbb{B}^{384k+32}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((keygenSpyData?.ekPKE?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.ekPKE ? Array.from(keygenSpyData.ekPKE) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "dkPKE_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="dk_{PKE} \in \mathbb{B}^{384k}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((keygenSpyData?.dkPKE?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.dkPKE ? Array.from(keygenSpyData.dkPKE) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "encapskey_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="ek \in \mathbb{B}^{384k+32}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((keygenSpyData?.publicKey?.length ?? 0) / 8)} cols={8} size={20} colorData={keygenSpyData?.publicKey} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "decapskey_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="dk \in \mathbb{B}^{768k+96}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((keygenSpyData?.secretKey?.length ?? 0) / 8)} cols={8} size={20} colorData={keygenSpyData?.secretKey} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {/* ── ENCAPSULATION ── */}
                                    {selectedVariable === "m_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="m \in \mathbb{B}^{32}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((encapsSpyData?.m?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.m ? Array.from(encapsSpyData.m) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "K_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="K" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((encapsSpyData?.K?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.K ? Array.from(encapsSpyData.K) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "r_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="r" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((encapsSpyData?.r?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.r ? Array.from(encapsSpyData.r) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "encapskey_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="ek \in \mathbb{B}^{384k+32}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((encapsSpyData?.ek?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.ek ? Array.from(encapsSpyData.ek) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "rho_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\rho \in \mathbb{B}^{32}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((encapsSpyData?.rho?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.rho ? Array.from(encapsSpyData.rho) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "t_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\hat{t}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((encapsSpyData?.tHat[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.tHat[0] ? Array.from(encapsSpyData.tHat[0]) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "mu_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\mu" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((encapsSpyData?.mu?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.mu ? Array.from(encapsSpyData.mu) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "A_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="A \in \mathbb{Z}_q^{k \times k}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((encapsSpyData?.A?.[0]?.[0].length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.A?.[0]?.[0] ? Array.from(encapsSpyData.A[0][0]) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "y_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="y" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((encapsSpyData?.y[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.y[0] ? Array.from(encapsSpyData.y[0]) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "e1_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="e_1" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((encapsSpyData?.e1[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.e1[0] ? Array.from(encapsSpyData.e1[0]) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "e2_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="e_2" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((encapsSpyData?.e2?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.e2 ? Array.from(encapsSpyData.e2) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "u_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="u" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((encapsSpyData?.u[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.u[0] ? Array.from(encapsSpyData.u[0]) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "c1_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="c_1" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((encapsSpyData?.c1?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.c1 ? Array.from(encapsSpyData.c1) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "v_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="v" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((encapsSpyData?.v?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.v ? Array.from(encapsSpyData.v) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "c2_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="c_2" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((encapsSpyData?.c2?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.c2 ? Array.from(encapsSpyData.c2) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "ciphertext_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="c = (c_1, c_2)" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((encapsSpyData?.cipherText?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.cipherText ? Array.from(encapsSpyData.cipherText) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {/* ── DECAPSULATION ── */}
                                    {selectedVariable === "ciphertext_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="c = (c_1, c_2)" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((decapsSpyData?.c?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.c ? Array.from(decapsSpyData.c) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "decapskey_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="dk \in \mathbb{B}^{768k+96}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((decapsSpyData?.dk?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.dk ? Array.from(decapsSpyData.dk) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "ekPKE_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="ek_{PKE} \in \mathbb{B}^{384k+32}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((decapsSpyData?.ekPKE?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.ekPKE ? Array.from(decapsSpyData.ekPKE) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "dkPKE_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="dk_{PKE} \in \mathbb{B}^{384k}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((decapsSpyData?.dkPKE?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.dkPKE ? Array.from(decapsSpyData.dkPKE) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "h_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="h = H(ek)" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((decapsSpyData?.h?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.h ? Array.from(decapsSpyData.h) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "z_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="z \in \mathbb{B}^{32}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((decapsSpyData?.z?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.z ? Array.from(decapsSpyData.z) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "c1_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="c_1" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((decapsSpyData?.c1?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.c1 ? Array.from(decapsSpyData.c1) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "c2_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="c_2" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((decapsSpyData?.c2?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.c2 ? Array.from(decapsSpyData.c2) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "u_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="u" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((decapsSpyData?.u[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.u[0] ? Array.from(decapsSpyData.u[0]) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "v_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="v" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((decapsSpyData?.v?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.v ? Array.from(decapsSpyData.v) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "s_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\hat{s}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((decapsSpyData?.sHat[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.sHat[0] ? Array.from(decapsSpyData.sHat[0]) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "w_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="w" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((decapsSpyData?.w?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.w ? Array.from(decapsSpyData.w) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "m_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="m'" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((decapsSpyData?.m?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.m ? Array.from(decapsSpyData.m) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "K'_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="K'" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((decapsSpyData?.K?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.K ? Array.from(decapsSpyData.K) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "r'_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="r'" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((decapsSpyData?.r?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.r ? Array.from(decapsSpyData.r) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "kbar_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\bar{K}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((decapsSpyData?.Kbar?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.Kbar ? Array.from(decapsSpyData.Kbar) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "c'_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="c'" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((decapsSpyData?.c?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.c ? Array.from(decapsSpyData.c) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "kfinal" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="K" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid rows={Math.ceil((decapsSpyData?.Kfinal?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.Kfinal ? Array.from(decapsSpyData.Kfinal) : []} showValues showTooltip={false} />
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className="flex flex-col rounded-xl bg-white dark:bg-zinc-900 h-full items-center justify-center p-2">
                                    <div>
                                        empt
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>    
                </div>
            </div>
        </div> 
    );
}