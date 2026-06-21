'use client';

import { useState, useEffect } from 'react';
import * as pqc from '@/lib/modified-pqc/ml-kem-modified';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, KeyIcon, LockOpenIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VariableDisplay, MatrixDisplay } from "@/components/ui/varDisplay";
import KeygenVisualization from './slides/keygenOuter';
import KeygenVisualizationProcess from './slides/keygenInner';
import EncapsulationVisualization from './slides/encapsOuter';
import EncapsulationVisualizationProcess from './slides/encapsInner';
import DecapsulationVisualization from './slides/decapsOuter';
import DecapsulationVisualizationProcess from './slides/decapsInner';
import { KeygenSpyData, EncapsSpyData, DecapsSpyData, createSpy } from '@/utils/createSpy';

export default function MLKEMPage() {
    const [vizStage, setVizStage] = useState<string | null>(null);
    const [selectedVariable, setSelectedVariable] = useState<string | null>(null);
    const [securityLevel, setSecurityLevel] = useState<KemSecurityLevel>('ml_kem512');
    const [selectedParam, setSelectedParam] = useState<KemParamKey>('k');
    const [aliceKeys, setAliceKeys] = useState<{ publicKey: Uint8Array; secretKey: Uint8Array } | null>(null);
    const [cipherText, setCipherText] = useState<Uint8Array | null>(null);
    const [sharedSecret, setsharedSecret] = useState<Uint8Array | null>(null);
    const [decapsulatedSecret, setDecapsulatedSecret] = useState<Uint8Array | null>(null);
    
    const [animationStep, setAnimationStep] = useState(0);
    const [animationComplete, setAnimationComplete] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const [keygenSpyData, setKeygenSpyData] = useState<KeygenSpyData | null>(null);
    const [encapsSpyData, setEncapsSpyData] = useState<EncapsSpyData | null>(null);
    const [decapsSpyData, setDecapsSpyData] = useState<DecapsSpyData | null>(null);

    const [step, setStep] = useState(1);
    useEffect(() => setStep(1), [vizStage]);

    const maxStep: Record<string, number> = {
        keygen0: 4,
        keygen1: 5,
        encapsulation0: 4,
        encapsulation1: 10,
        decapsulation0: 8,
        decapsulation1: 5,
    };

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
        }
    };

    const startAnimation = () => {
        if (isAnimating) return;
        
        setIsAnimating(true);
        setAnimationStep(0);
        setAnimationComplete(false);
        
        let currentStep = 0;
        const interval = setInterval(() => {
            currentStep++;
            setAnimationStep(currentStep);
            
            setAnimationComplete(currentStep >= 3);
            
            if (currentStep >= 4) {
                clearInterval(interval);
                setIsAnimating(false);
            }
        }, 1200);
    };

    const resetAnimation = () => {
        setAnimationStep(0);
        setAnimationComplete(false);
        setIsAnimating(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 pb-8 border-b border-slate-700 text-slate-400 text-sm">
                    <Link href="/" className="text-blue-400 hover:text-blue-300">
                        ← Back
                    </Link>
                </div>
                <div className="rounded-xl bg-slate-800 p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-white flex items-center">Module Lattice Based Key Encapsulation Mechanism Standard (ML-KEM)</h2>
                    <p className="text-slate-300 leading-relaxed mb-4">
                        ML-KEM is a{" "}
                    <Link href="/glossary#latticedef" className="text-blue-400 hover:text-blue-300 underline">
                       lattice-based
                    </Link>{" "}
                    key encapsulation mechanism standardized by NIST's FIPS 203 publication that provides a quantum resistant method of establishing shared secret keys between parties communicating over a public channel. It's set to replace current key encapsulation algorithms such as RSA (Rivest-Shamir-Adleman) and Diffie-Hellman.
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                    ML-KEM based on the hardness of the{" "}
                    <Link href="/glossary#latticeproblems" className="text-blue-400 hover:text-blue-300 underline">
                        MLWE (Module Learning With Errors)
                    </Link>{" "}
                    problem, which is itself based on the idea of inferring a linear function over noisy data. The
                    problem is considered to be quantum resistant, which carries over to ML-KEM.
                    </p>
                </div>
                <div className="rounded-xl bg-slate-800 p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-white">ML-KEM Key Exchange Process</h2>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                        {!isAnimating && animationStep === 0 && (
                            <div className="flex flex-row gap-4 h-[555px]">
                                <div className="bg-emerald-50 rounded-lg p-4 flex-1 border border-emerald-200 flex flex-col gap-4 justify-center">
                                    <h3 className="font-semibold text-xl text-emerald-800 text-center mb-2">Key Generation</h3>
                                    <KeyIcon className="size-15 text-emerald-600 mx-auto mb-2" />
                                    <p className="text-sm text-center text-emerald-700">Creates <strong>encapsulation/public + decapsulation/private</strong> key pair</p>
                                </div>
                                <div className="bg-blue-50 rounded-lg p-4 flex-1 border border-blue-200 flex flex-col gap-4 justify-center">
                                    <h3 className="font-semibold text-xl text-blue-800 text-center mb-2">Encapsulation</h3>
                                    <LockClosedIcon className="size-15 text-blue-600 mx-auto mb-2" />
                                    <p className="text-sm text-center text-blue-700">Locks a <strong>random secret</strong> with encapsulation/public key</p>
                                </div>
                                <div className="bg-amber-50 rounded-lg p-4 flex-1 border border-amber-200 flex flex-col gap-4 justify-center">
                                    <h3 className="font-semibold text-xl text-amber-800 text-center mb-2">Decapsulation</h3>
                                    <LockOpenIcon className="size-15 text-amber-600 mx-auto mb-2" />
                                    <p className="text-sm text-center text-amber-700">Unlocks the <strong>secret</strong> with decapsulation/private key</p>
                                </div>
                            </div>
                        )}
                        {(isAnimating || animationStep > 0) && ( 
                            <>
                            <div className="flex flex-col md:flex-row items-center justify-center mb-8 text">
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
                                                {/* Step 1: Generate Keys */}
                                                <div className={`bg-white rounded-lg p-4 border border-blue-100 transition-all duration-500 
                                                    ${animationStep >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-sm font-medium text-blue-800">1. Generates Key Pair</p>
                                                        {animationStep >= 1 && (
                                                            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div className="flex justify-center space-x-4 mt-2">
                                                        <div className="text-center">
                                                            <KeyIcon className="size-8 text-yellow-400 mx-auto" />
                                                            <p className="text-xs text-gray-600 mt-1">Encapsulation Key</p>
                                                        </div>
                                                        <div className="text-center">
                                                            <KeyIcon className="size-8 text-gray-400 mx-auto" />
                                                            <p className="text-xs text-gray-600 mt-1">Decapsulation Key</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Step 4: Decapsulate */}
                                                <div className={`bg-white rounded-lg p-4 border border-blue-100 transition-all duration-500 delay-700
                                                    ${animationStep >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-sm font-medium text-blue-800">4. Decapsulates Shared Secret</p>
                                                        {animationStep >= 4 && (
                                                            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-row justify-center mt-2 gap-4">
                                                        <div className="text-center">
                                                            <div className="w-16 h-8 bg-purple-400 rounded-full border-2 border-purple-600 mx-auto flex items-center justify-center">
                                                                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                                </svg>
                                                            </div>
                                                            <p className="text-xs text-gray-600 mt-1">Shared Secret ✓</p>
                                                        </div>
                                                        <div className="text-center">
                                                            <KeyIcon className="size-8 text-gray-400 mx-auto" />
                                                            <p className="text-xs text-gray-600 mt-1">Decapsulation Key</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Middle Arrows */}
                                    <div className="w-full md:w-2/12 py-4 flex flex-col items-center justify-center">
                                        <div className={`hidden md:block w-full h-0.5 bg-blue-300 my-2 transition-all duration-700 
                                            ${animationStep >= 2 ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}></div>
                                        <div className="md:hidden h-20 w-0.5 bg-blue-300 my-2"></div>
                                        
                                        <div className={`bg-white rounded-full p-3 shadow-md transition-all duration-700 
                                            ${animationStep >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                            </svg>
                                        </div>
                                        
                                        {animationStep >= 2 && (
                                            <div className="absolute transform translate-x-16 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                                                E. Key →
                                            </div>
                                        )}
                                        
                                        <div className={`hidden md:block w-full h-0.5 bg-green-300 my-2 transition-all duration-700 
                                            ${animationStep >= 3 ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}></div>
                                        <div className="md:hidden h-20 w-0.5 bg-green-300 my-2"></div>
                                        
                                        {animationStep >= 3 && (
                                            <div className="absolute transform -translate-x-16 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                                                ← Ciphertext
                                            </div>
                                        )}
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
                                                {/* Step 2: Receive Key */}
                                                <div className={`bg-white rounded-lg p-4 border border-green-100 transition-all duration-500 
                                                    ${animationStep >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-sm font-medium text-green-800">2. Receives Alice's Encapsulation Key</p>
                                                        {animationStep >= 2 && (
                                                            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div className="flex justify-center mt-2">
                                                        <div className="text-center">
                                                            <KeyIcon className="size-8 text-yellow-400 mx-auto" />
                                                            <p className="text-xs text-gray-600 mt-1">Encapsulation Key</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Step 3: Encapsulate */}
                                                <div className={`bg-white rounded-lg p-4 border border-green-100 transition-all duration-500 
                                                    ${animationStep >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-sm font-medium text-green-800">3. Encapsulates Shared Secret</p>
                                                        {animationStep >= 3 && (
                                                            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div className="flex justify-center space-x-4 mt-2">
                                                        <div className="text-center">
                                                            <div className="w-12 h-8 bg-orange-400 rounded border-2 border-orange-600 mx-auto"></div>
                                                            <p className="text-xs text-gray-600 mt-1">Ciphertext</p>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="w-12 h-8 bg-purple-400 rounded-full border-2 border-purple-600 mx-auto"></div>
                                                            <p className="text-xs text-gray-600 mt-1">Secret</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Completion Message */}
                            <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 transition-all duration-700 
                                ${animationComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                <div className="flex items-start">
                                    <svg className="h-6 w-6 mr-2 text-green-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="font-semibold text-green-800 mb-1">✓ Key Exchange Complete!</p>
                                        <p className="text-sm text-green-700">
                                            Alice and Bob now share an identical secret key without ever transmitting it directly.
                                            This shared secret can now be used for encrypted communication. 
                                            <br />
                                            <br />
                                            (During an actual key exchange, only the encapsulation/public key and ciphertext are transmitted across the network. The shared secret and decapsulation/private key remain confidential to each party.)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>)}
                    </div>
                    
                    <div className="flex justify-center gap-4 mt-6">
                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={startAnimation}
                            disabled={isAnimating}
                        >
                            {isAnimating ? "Animating..." : "Animate Key Exchange"}
                        </Button>
                        
                        {animationStep > 0 && (
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={resetAnimation}
                                disabled={isAnimating}
                            >
                                ↺ Reset
                            </Button>
                        )}
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
                                    {vizStage === "keygen0" && <KeygenVisualization onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} spyData={keygenSpyData} step={step} />}
                                    {vizStage === "keygen1" && <KeygenVisualizationProcess onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} spyData={keygenSpyData} step={step} />}
                                    {vizStage === "encapsulation0" && <EncapsulationVisualization onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} spyData={encapsSpyData} step={step} />}
                                    {vizStage === "encapsulation1" && <EncapsulationVisualizationProcess onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} spyData={encapsSpyData} step={step} />}
                                    {vizStage === "decapsulation0" && <DecapsulationVisualization onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} spyData={decapsSpyData} step={step} />}
                                    {vizStage === "decapsulation1" && <DecapsulationVisualizationProcess onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} spyData={decapsSpyData} step={step} />}
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
                                    <div className="flex flex-wrap justify-center gap-2 w-full">
                                    {parameters.map((param) => (
                                        <button
                                        key={param.key}
                                        onClick={() => setSelectedParam(param.key as KemParamKey)}
                                        className={`
                                            px-2.5 py-1 rounded-md text-xs  transition-all
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

                                    {currentParams && (
                                    <div className="w-full mt-1 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-center">
                                        <div className="text-xl  font-bold">
                                        {currentParamValue}
                                        </div>
                                    </div>
                                    )}
                                </div>
                                <div className="flex rounded-xl bg-slate-100 dark:bg-zinc-900 h-full h-[360px] items-center justify-center p-2">
                                    <div className="flex rounded-xl bg-slate-100 dark:bg-zinc-900 h-full items-center justify-center p-2 overflow-hidden">
                                        {(vizStage === null || selectedVariable === null) &&
                                            <div className="text-center">
                                                <p className="mb-2">Click a variable to see it in full!</p>
                                                <p>Hover over it to see a short description!</p>
                                            </div>
                                        }
                                        
                                        {/* ── KEYGEN ── */}
                                        {selectedVariable === "d" &&
                                            <VariableDisplay 
                                                math="d \in \mathbb{B}^{32}"
                                                description="32 byte seed"
                                                data={keygenSpyData?.d}
                                                variableKey="d"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "z_keygen" &&
                                            <VariableDisplay 
                                                math="z \in \mathbb{B}^{32}"
                                                description="32 byte seed"
                                                data={keygenSpyData?.z}
                                                variableKey="z_keygen"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "rho_keygen" &&
                                            <VariableDisplay 
                                                math="\rho \in \mathbb{B}^{32}"
                                                description="32 byte seed for A generation"
                                                data={keygenSpyData?.rho}
                                                variableKey="rho_keygen"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "sigma_keygen" &&
                                            <VariableDisplay 
                                                math="\sigma \in \mathbb{B}^{32}"
                                                description="32 byte seed"
                                                data={keygenSpyData?.sigma}
                                                variableKey="sigma_keygen"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "A_keygen" &&
                                            <MatrixDisplay 
                                                math="\hat{A} \in \mathbb{Z}_q^{k \times k}"
                                                description="k×k matrix of polynomials (NTT domain)"
                                                matrix={keygenSpyData?.A}
                                                variableKey="A_keygen"
                                            />
                                        }

                                        {selectedVariable === "s_keygen" &&
                                            <VariableDisplay 
                                                math="\hat{s} \in \mathbb{Z}_q^{k}"
                                                description="secret vector in NTT domain"
                                                data={keygenSpyData?.sHat?.[0]}
                                                variableKey="s_keygen"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "e_keygen" &&
                                            <VariableDisplay 
                                                math="\hat{e} \in \mathbb{Z}_q^{k}"
                                                description="error vector in NTT domain"
                                                data={keygenSpyData?.eHat?.[0]}
                                                variableKey="e_keygen"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "t_keygen" &&
                                            <VariableDisplay 
                                                math="\hat{t} \in \mathbb{Z}_q^{k}"
                                                description="public key component in NTT domain (t = A∘s + e)"
                                                data={keygenSpyData?.tHat?.[0]}
                                                variableKey="t_keygen"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "ekPKE_keygen" &&
                                            <VariableDisplay 
                                                math="ek_{PKE} \in \mathbb{B}^{384k+32}"
                                                description="PKE encryption key (ρ + t̂)"
                                                data={keygenSpyData?.ekPKE}
                                                variableKey="ekPKE_keygen"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "dkPKE_keygen" &&
                                            <VariableDisplay 
                                                math="dk_{PKE} \in \mathbb{B}^{384k}"
                                                description="PKE decryption key (ŝ)"
                                                data={keygenSpyData?.dkPKE}
                                                variableKey="dkPKE_keygen"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "encapskey_keygen" &&
                                            <VariableDisplay 
                                                math="ek \in \mathbb{B}^{384k+32}"
                                                description="Encapsulation key (public key)"
                                                data={keygenSpyData?.publicKey}
                                                variableKey="encapskey_keygen"
                                                cols={8}
                                            />
                                        }

                                        {selectedVariable === "decapskey_keygen" &&
                                            <VariableDisplay 
                                                math="dk \in \mathbb{B}^{768k+96}"
                                                description="Decapsulation key (secret key)"
                                                data={keygenSpyData?.secretKey}
                                                variableKey="decapskey_keygen"
                                                cols={8}
                                            />
                                        }

                                        {/* ── ENCAPSULATION ── */}
                                        {selectedVariable === "m_encaps" &&
                                            <VariableDisplay 
                                                math="m \in \mathbb{B}^{32}"
                                                description="32 byte random message"
                                                data={encapsSpyData?.m}
                                                variableKey="m_encaps"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "K_encaps" &&
                                            <VariableDisplay 
                                                math="K"
                                                description="shared secret from encapsulation"
                                                data={encapsSpyData?.K}
                                                variableKey="K_encaps"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "r_encaps" &&
                                            <VariableDisplay 
                                                math="r"
                                                description="randomness for encapsulation"
                                                data={encapsSpyData?.r}
                                                variableKey="r_encaps"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "encapskey_encaps" &&
                                            <VariableDisplay 
                                                math="ek \in \mathbb{B}^{384k+32}"
                                                description="Encapsulation key"
                                                data={encapsSpyData?.ek}
                                                variableKey="encapskey_encaps"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "rho_encaps" &&
                                            <VariableDisplay 
                                                math="\rho \in \mathbb{B}^{32}"
                                                description="seed from public key"
                                                data={encapsSpyData?.rho}
                                                variableKey="rho_encaps"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "t_encaps" &&
                                            <VariableDisplay 
                                                math="\hat{t}"
                                                description="t̂ from public key (NTT domain)"
                                                data={encapsSpyData?.tHat?.[0]}
                                                variableKey="t_encaps"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "mu_encaps" &&
                                            <VariableDisplay 
                                                math="\mu = H(ek)"
                                                description="32 byte hash of public key"
                                                data={encapsSpyData?.mu}
                                                variableKey="mu_encaps"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "A_encaps" &&
                                            <MatrixDisplay 
                                                math="\hat{A} \in \mathbb{Z}_q^{k \times k}"
                                                description="matrix from ρ (NTT domain)"
                                                matrix={encapsSpyData?.A}
                                                variableKey="A_encaps"
                                            />
                                        }

                                        {selectedVariable === "y_encaps" &&
                                            <VariableDisplay 
                                                math="y"
                                                description="random vector from r"
                                                data={encapsSpyData?.y?.[0]}
                                                variableKey="y_encaps"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "e1_encaps" &&
                                            <VariableDisplay 
                                                math="e_1"
                                                description="error vector e₁"
                                                data={encapsSpyData?.e1?.[0]}
                                                variableKey="e1_encaps"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "e2_encaps" &&
                                            <VariableDisplay 
                                                math="e_2"
                                                description="error polynomial e₂"
                                                data={encapsSpyData?.e2}
                                                variableKey="e2_encaps"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "u_encaps" &&
                                            <VariableDisplay 
                                                math="u = A^T y + e_1"
                                                description="ciphertext component u"
                                                data={encapsSpyData?.u?.[0]}
                                                variableKey="u_encaps"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "c1_encaps" &&
                                            <VariableDisplay 
                                                math="c_1"
                                                description="compressed u"
                                                data={encapsSpyData?.c1}
                                                variableKey="c1_encaps"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "v_encaps" &&
                                            <VariableDisplay 
                                                math="v"
                                                description="ciphertext component v"
                                                data={encapsSpyData?.v}
                                                variableKey="v_encaps"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "c2_encaps" &&
                                            <VariableDisplay 
                                                math="c_2"
                                                description="compressed v"
                                                data={encapsSpyData?.c2}
                                                variableKey="c2_encaps"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "ciphertext_encaps" &&
                                            <VariableDisplay 
                                                math="c"
                                                description="final ciphertext (compressed)"
                                                data={encapsSpyData?.cipherText}
                                                variableKey="ciphertext_encaps"
                                                cols={8}
                                            />
                                        }

                                        {/* ── DECAPSULATION ── */}
                                        {selectedVariable === "ciphertext_decaps" &&
                                            <VariableDisplay 
                                                math="c"
                                                description="received ciphertext"
                                                data={decapsSpyData?.c}
                                                variableKey="ciphertext_decaps"
                                                cols={8}
                                            />
                                        }

                                        {selectedVariable === "decapskey_decaps" &&
                                            <VariableDisplay 
                                                math="dk \in \mathbb{B}^{768k+96}"
                                                description="Decapsulation key"
                                                data={decapsSpyData?.dk}
                                                variableKey="decapskey_decaps"
                                                cols={8}
                                            />
                                        }

                                        {selectedVariable === "ekPKE_decaps" &&
                                            <VariableDisplay 
                                                math="ek_{PKE} \in \mathbb{B}^{384k+32}"
                                                description="PKE encryption key"
                                                data={decapsSpyData?.ekPKE}
                                                variableKey="ekPKE_decaps"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "dkPKE_decaps" &&
                                            <VariableDisplay 
                                                math="dk_{PKE} \in \mathbb{B}^{384k}"
                                                description="PKE decryption key"
                                                data={decapsSpyData?.dkPKE}
                                                variableKey="dkPKE_decaps"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "h_decaps" &&
                                            <VariableDisplay 
                                                math="h = H(ek)"
                                                description="hash of public key"
                                                data={decapsSpyData?.h}
                                                variableKey="h_decaps"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "z_decaps" &&
                                            <VariableDisplay 
                                                math="z \in \mathbb{B}^{32}"
                                                description="32 byte seed from secret key"
                                                data={decapsSpyData?.z}
                                                variableKey="z_decaps"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "c1_decaps" &&
                                            <VariableDisplay 
                                                math="c_1"
                                                description="decompressed u"
                                                data={decapsSpyData?.c1}
                                                variableKey="c1_decaps"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "c2_decaps" &&
                                            <VariableDisplay 
                                                math="c_2"
                                                description="decompressed v"
                                                data={decapsSpyData?.c2}
                                                variableKey="c2_decaps"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "u_decaps" &&
                                            <VariableDisplay 
                                                math="u'"
                                                description="reconstructed u"
                                                data={decapsSpyData?.u?.[0]}
                                                variableKey="u_decaps"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "v_decaps" &&
                                            <VariableDisplay 
                                                math="v'"
                                                description="reconstructed v"
                                                data={decapsSpyData?.v}
                                                variableKey="v_decaps"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "s_decaps" &&
                                            <VariableDisplay 
                                                math="\hat{s}"
                                                description="secret key component (NTT domain)"
                                                data={decapsSpyData?.sHat?.[0]}
                                                variableKey="s_decaps"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "w_decaps" &&
                                            <VariableDisplay 
                                                math="w"
                                                description="recovered message (v - s^T u)"
                                                data={decapsSpyData?.w}
                                                variableKey="w_decaps"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "m_decaps" &&
                                            <VariableDisplay 
                                                math="m'"
                                                description="decrypted message"
                                                data={decapsSpyData?.m}
                                                variableKey="m_decaps"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "Kp_decaps" &&
                                            <VariableDisplay 
                                                math="K'"
                                                description="derived shared secret"
                                                data={decapsSpyData?.K}
                                                variableKey="Kp_decaps"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "rp_decaps" &&
                                            <VariableDisplay 
                                                math="r'"
                                                description="recomputed randomness"
                                                data={decapsSpyData?.r}
                                                variableKey="rp_decaps"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "kbar_decaps" &&
                                            <VariableDisplay 
                                                math="\bar{K}"
                                                description="alternative shared secret (for failure case)"
                                                data={decapsSpyData?.Kbar}
                                                variableKey="kbar_decaps"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "cp_decaps" &&
                                            <VariableDisplay 
                                                math="c'"
                                                description="recomputed ciphertext"
                                                data={decapsSpyData?.c}
                                                variableKey="cp_decaps"
                                                cols={8}
                                            />
                                        }

                                        {selectedVariable === "kfinal" &&
                                            <VariableDisplay 
                                                math="K"
                                                description="final shared secret (K' if valid, else K̄)"
                                                data={decapsSpyData?.Kfinal}
                                                variableKey="kfinal"
                                                cols={4}
                                            />
                                        }
                                    </div>
                                </div>
                                <div className="flex flex-col rounded-xl bg-white dark:bg-zinc-900 h-48 items-center justify-center p-2">
                                    <div className="flex items-center gap-3 bg-gray-100 dark:bg-zinc-800 rounded-full px-2 py-1 shadow-sm">
                                        <button 
                                            onClick={() => setStep(s => s - 1)} 
                                            disabled={step <= 1}
                                            className={`
                                                p-2 rounded-full transition-all duration-200
                                                ${step <= 1 
                                                    ? "text-gray-400 cursor-not-allowed opacity-50" 
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 hover:shadow-md active:scale-95 cursor-pointer"
                                                }
                                            `}
                                            aria-label="Previous step"
                                        >
                                            <ChevronLeftIcon className="size-5" />
                                        </button>
                                        <div className="min-w-[60px] text-center">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Step {step}
                                            </span>
                                            <span className="text-xs text-gray-400 dark:text-gray-500 ml-0.5">
                                                / {maxStep[vizStage ?? ""] ?? 1}
                                            </span>
                                        </div>
                                        <button 
                                            onClick={() => setStep(s => s + 1)} 
                                            disabled={step >= (maxStep[vizStage ?? ""] ?? 1)}
                                            className={`
                                                p-2 rounded-full transition-all duration-200
                                                ${step >= (maxStep[vizStage ?? ""] ?? 1)
                                                    ? "text-gray-400 cursor-not-allowed opacity-50" 
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 hover:shadow-md active:scale-95 cursor-pointer"
                                                }
                                            `}
                                            aria-label="Next step"
                                        >
                                            <ChevronRightIcon className="size-5" />
                                        </button>
                                    </div>
                                    <div className="flex gap-1.5 mt-3">
                                        {Array.from({ length: maxStep[vizStage ?? ""] ?? 1 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={`
                                                    h-1.5 rounded-full transition-all duration-200
                                                    ${i + 1 === step 
                                                        ? "w-4 bg-blue-500" 
                                                        : "w-1.5 bg-gray-300 dark:bg-zinc-600"
                                                    }
                                                `}
                                            />
                                        ))}
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