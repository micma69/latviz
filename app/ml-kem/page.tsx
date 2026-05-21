'use client';

import React, { useState, useEffect } from 'react';
import * as pqc from '@/lib/modified-pqc/ml-kem-modified';
import Link from "next/link";
import { InlineMath } from 'react-katex';
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, KeyIcon, LockOpenIcon, LockClosedIcon } from '@heroicons/react/24/solid';
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
                        ML-KEM is a lattice based key encapsulation mechanism standardized by NIST's FIPS 203 publication that provides a quantum resistant method of establishing shared secret keys between parties communicating over a public channel. It's set to replace current key encapsulation algorithms such as RSA (Rivest-Shamir-Adleman) and Diffie-Hellman.
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        ML-KEM based on the hardness of the MLWE (Module Learning With Errors) problem, which is itself based on the idea of inferring a linear function over noisy data. The problem is considered to be quantum resistant, which carries over to ML-KEM.
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
                                    {/* Clickable parameter row */}
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

                                    {/* Value panel - shows current param value */}
                                    {currentParams && (
                                    <div className="w-full mt-1 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-center">
                                        <div className="text-xl  font-bold">
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
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((keygenSpyData?.d?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.d ? Array.from(keygenSpyData.d) : []} showValues variableKey='d' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "z_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="z \in \mathbb{B}^{32}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((keygenSpyData?.z?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.z ? Array.from(keygenSpyData.z) : []} showValues variableKey='z_keygen' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "rho_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\rho \in \mathbb{B}^{32}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((keygenSpyData?.rho?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.rho ? Array.from(keygenSpyData.rho) : []} showValues variableKey='rho_keygen' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "sigma_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\sigma \in \mathbb{B}^{32}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((keygenSpyData?.sigma?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.sigma ? Array.from(keygenSpyData.sigma) : []} showValues variableKey='sigma_keygen' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "A_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="A \in \mathbb{Z}_q^{k \times k}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil(keygenSpyData?.A?.[0]?.[0].length ?? 0) / 4} cols={4} size={20} colorData={keygenSpyData?.A?.[0]?.[0] ? Array.from(keygenSpyData.A[0][0]) : []} showValues variableKey='A_keygen' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "s_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="s \in \mathbb{Z}_q^{k}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((keygenSpyData?.sHat[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.sHat[0] ? Array.from(keygenSpyData.sHat[0]) : []} showValues variableKey='s_keygen' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "e_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="e \in \mathbb{Z}_q^{k}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((keygenSpyData?.eHat[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.eHat[0] ? Array.from(keygenSpyData.eHat[0]) : []} showValues variableKey='e_keygen' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "t_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="t \in \mathbb{Z}_q^{k}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((keygenSpyData?.tHat[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.tHat[0] ? Array.from(keygenSpyData.tHat[0]) : []} showValues variableKey='t_keygen' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "ekPKE_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="ek_{PKE} \in \mathbb{B}^{384k+32}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((keygenSpyData?.ekPKE?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.ekPKE ? Array.from(keygenSpyData.ekPKE) : []} showValues variableKey='ekPKE_keygen' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "dkPKE_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="dk_{PKE} \in \mathbb{B}^{384k}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((keygenSpyData?.dkPKE?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.dkPKE ? Array.from(keygenSpyData.dkPKE) : []} showValues variableKey='dkPKE_keygen' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "encapskey_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="ek \in \mathbb{B}^{384k+32}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((keygenSpyData?.publicKey?.length ?? 0) / 8)} cols={8} size={20} colorData={keygenSpyData?.publicKey} showValues variableKey='encapskey_keygen' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "decapskey_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="dk \in \mathbb{B}^{768k+96}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((keygenSpyData?.secretKey?.length ?? 0) / 8)} cols={8} size={20} colorData={keygenSpyData?.secretKey} showValues variableKey='decapskey_keygen' />
                                            </div>
                                        </div>
                                    }

                                    {/* ── ENCAPSULATION ── */}
                                    {selectedVariable === "m_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="m \in \mathbb{B}^{32}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((encapsSpyData?.m?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.m ? Array.from(encapsSpyData.m) : []} showValues variableKey='m_encaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "K_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="K" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((encapsSpyData?.K?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.K ? Array.from(encapsSpyData.K) : []} showValues variableKey='K_encaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "r_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="r" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((encapsSpyData?.r?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.r ? Array.from(encapsSpyData.r) : []} showValues variableKey='r_encaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "encapskey_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="ek \in \mathbb{B}^{384k+32}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((encapsSpyData?.ek?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.ek ? Array.from(encapsSpyData.ek) : []} showValues variableKey='encapskey_encaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "rho_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\rho \in \mathbb{B}^{32}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((encapsSpyData?.rho?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.rho ? Array.from(encapsSpyData.rho) : []} showValues variableKey='rho_encaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "t_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\hat{t}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((encapsSpyData?.tHat[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.tHat[0] ? Array.from(encapsSpyData.tHat[0]) : []} showValues variableKey='t_encaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "mu_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\mu" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((encapsSpyData?.mu?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.mu ? Array.from(encapsSpyData.mu) : []} showValues variableKey='mu_encaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "A_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="A \in \mathbb{Z}_q^{k \times k}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((encapsSpyData?.A?.[0]?.[0].length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.A?.[0]?.[0] ? Array.from(encapsSpyData.A[0][0]) : []} showValues variableKey='A_encaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "y_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="y" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((encapsSpyData?.y[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.y[0] ? Array.from(encapsSpyData.y[0]) : []} showValues variableKey='y_encaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "e1_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="e_1" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((encapsSpyData?.e1[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.e1[0] ? Array.from(encapsSpyData.e1[0]) : []} showValues variableKey='e1_encaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "e2_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="e_2" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((encapsSpyData?.e2?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.e2 ? Array.from(encapsSpyData.e2) : []} showValues variableKey='e2_encaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "u_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="u" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((encapsSpyData?.u[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.u[0] ? Array.from(encapsSpyData.u[0]) : []} showValues variableKey='u_encaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "c1_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="c_1" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((encapsSpyData?.c1?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.c1 ? Array.from(encapsSpyData.c1) : []} showValues variableKey='c1_encaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "v_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="v" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((encapsSpyData?.v?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.v ? Array.from(encapsSpyData.v) : []} showValues variableKey='v_encaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "c2_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="c_2" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((encapsSpyData?.c2?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.c2 ? Array.from(encapsSpyData.c2) : []} showValues variableKey='c2_encaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "ciphertext_encaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="c" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((encapsSpyData?.cipherText?.length ?? 0) / 4)} cols={4} size={20} colorData={encapsSpyData?.cipherText ? Array.from(encapsSpyData.cipherText) : []} showValues variableKey='ciphertext_encaps' />
                                            </div>
                                        </div>
                                    }

                                    {/* ── DECAPSULATION ── */}
                                    {selectedVariable === "ciphertext_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="c = (c_1, c_2)" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((decapsSpyData?.c?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.c ? Array.from(decapsSpyData.c) : []} showValues variableKey='ciphertext_decaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "decapskey_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="dk \in \mathbb{B}^{768k+96}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((decapsSpyData?.dk?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.dk ? Array.from(decapsSpyData.dk) : []} showValues variableKey='decapskey_decaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "ekPKE_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="ek_{PKE} \in \mathbb{B}^{384k+32}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((decapsSpyData?.ekPKE?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.ekPKE ? Array.from(decapsSpyData.ekPKE) : []} showValues variableKey='ekPKE_decaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "dkPKE_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="dk_{PKE} \in \mathbb{B}^{384k}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((decapsSpyData?.dkPKE?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.dkPKE ? Array.from(decapsSpyData.dkPKE) : []} showValues variableKey='dkPKE_decaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "h_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="h = H(ek)" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((decapsSpyData?.h?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.h ? Array.from(decapsSpyData.h) : []} showValues variableKey='h_decaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "z_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="z \in \mathbb{B}^{32}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((decapsSpyData?.z?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.z ? Array.from(decapsSpyData.z) : []} showValues variableKey='z_decaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "c1_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="c_1" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((decapsSpyData?.c1?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.c1 ? Array.from(decapsSpyData.c1) : []} showValues variableKey='c1_decaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "c2_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="c_2" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((decapsSpyData?.c2?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.c2 ? Array.from(decapsSpyData.c2) : []} showValues variableKey='c2_decaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "u_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="u" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((decapsSpyData?.u[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.u[0] ? Array.from(decapsSpyData.u[0]) : []} showValues variableKey='u_decaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "v_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="v" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((decapsSpyData?.v?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.v ? Array.from(decapsSpyData.v) : []} showValues variableKey='v_decaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "s_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\hat{s}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((decapsSpyData?.sHat[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.sHat[0] ? Array.from(decapsSpyData.sHat[0]) : []} showValues variableKey='s_decaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "w_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="w" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((decapsSpyData?.w?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.w ? Array.from(decapsSpyData.w) : []} showValues variableKey='w_decaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "m_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="m'" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((decapsSpyData?.m?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.m ? Array.from(decapsSpyData.m) : []} showValues variableKey='m_decaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "Kp_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="K'" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((decapsSpyData?.K?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.K ? Array.from(decapsSpyData.K) : []} showValues variableKey='Kp_decaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "rp_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="r'" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((decapsSpyData?.r?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.r ? Array.from(decapsSpyData.r) : []} showValues variableKey='rp_decaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "kbar_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\bar{K}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((decapsSpyData?.Kbar?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.Kbar ? Array.from(decapsSpyData.Kbar) : []} showValues variableKey='kbar_decaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "cp_decaps" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="c'" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((decapsSpyData?.c?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.c ? Array.from(decapsSpyData.c) : []} showValues variableKey='cp_decaps' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "kfinal" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="K" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mlkem" rows={Math.ceil((decapsSpyData?.Kfinal?.length ?? 0) / 4)} cols={4} size={20} colorData={decapsSpyData?.Kfinal ? Array.from(decapsSpyData.Kfinal) : []} showValues variableKey='kfinal' />
                                            </div>
                                        </div>
                                    }
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