'use client';

import React, { useState, useEffect } from 'react';
import * as pqc from 'pqc';
import Link from "next/link";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import KeygenVisualization from './slides/keygenVisualization';
import KeygenVisualizationProcess from './slides/keygenVisualizationProcess';
import EncapsulationVisualization from './slides/encapsulationVisualization';
import EncapsulationVisualizationProcess from './slides/encapsulationVisualizationProcess';
import DecapsulationVisualization from './slides/decapsulationVisualization';
import DecapsulationVisualizationProcess from './slides/decapsulationVisualizationProcess';

export default function MLKEMPage() {
    const [vizStage, setVizStage] = useState<string | null>(null);
    const [selectedVariable, setSelectedVariable] = useState<string | null>(null);
    const [securityLevel, setSecurityLevel] = useState("ml_kem768");
    const [aliceKeys, setAliceKeys] = useState<any>(null);
    const [cipherText, setCipherText] = useState<any>(null);
    const [sharedSecret, setsharedSecret] = useState<any>(null);
    const [decapsulatedSecret, setDecapsulatedSecret] = useState<Uint8Array | null>(null);
    const [output, setOutput] = useState<string[]>([]);

    const [expandedPublicKey, setExpandedPublicKey] = useState(false);
    const [expandedSecretKey, setExpandedSecretKey] = useState(false);
    const [expandedCipherText, setExpandedCipherText] = useState(false);
    const [expandedSharedSecret, setExpandedSharedSecret] = useState(false);
    const [expandedDecapsulatedSecret, setExpandedDecapsulatedSecret] = useState(false);

    const [flow, setFlow] = useState<Record<string, unknown> | null>(null);
    const [animationStep, setAnimationStep] = useState(0);
    const [animationComplete, setAnimationComplete] = useState(false);

    const addOutput = (message: string) => {
        setOutput(prev => [...prev, message]);
    };

    useEffect(() => {
        setAliceKeys(null);
        setCipherText(null);
        setsharedSecret(null);
        setVizStage(null);
        setSelectedVariable(null);
        setOutput(["Security level changed."]);
    }, [securityLevel]);

    const mlKemLevels = [
        { label: 'ML-KEM-512 (128-bit security)', value: 'ml_kem512' },
        { label: 'ML-KEM-768 (192-bit security)', value: 'ml_kem768' },
        { label: 'ML-KEM-1024 (256-bit security)', value: 'ml_kem1024' }
    ];

    const executeMLKEM = async (operation: string) => {
        const kem = pqc.ml_kem[securityLevel];

        switch (operation) {
            case "Key Generation": {
                const keys = kem.keygen();
                setAliceKeys(keys);
                setCipherText(null);
                setsharedSecret(null);
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
                setsharedSecret(result.sharedSecret);
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

                setDecapsulatedSecret(aliceShared);

                const match =
                    Buffer.from(aliceShared).toString("hex") ===
                    Buffer.from(sharedSecret).toString("hex");

                addOutput("Decapsulation complete.");
                addOutput(`Secrets match: ${match ? "YES" : "NO"}`);  
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

    const formatArray = (bytes: Uint8Array | null) => {
    if (!bytes) return "";
    return `[${Array.from(bytes).join(", ")}]`;
    };

    const previewArray = (bytes: Uint8Array | null, count = 5) => {
        if (!bytes) return "";
        const arr = Array.from(bytes.slice(0, count));
        return `[${arr.join(", ")}, ...]`;
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
                        <div className="rounded-xl">
                            <p className="font-semibold text-yellow-800 mb-1"> Extra Notes:</p>
                            <p className="text-sm text-yellow-700">
                                During an actual key exchange, only the public key and ciphertext would be transmitted across the network. The shared secret and private key remain confidential to each party.</p>
                        </div>
                        <div className="flex justify-center">
                            <Button
                                variant="secondary"
                                size="lg"
                                onClick={() => executeMLKEM("Complete Flow")}
                            >
                                TEST
                            </Button>
                        </div>
                </div>
                <div className="rounded-xl bg-slate-800 p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-white">ML-KEM Full Visualization</h2>
                    <div className="grid grid-cols-1 md:grid-cols-[2.5fr_1.5fr]">
                        <div className="flex flex-col gap-4">
                            <main className="flex-1 rounded-xl bg-white dark:bg-zinc-900 shadow-xl p-5">
                                <div className="rounded-xl bg-slate-100 dark:bg-zinc-900 p-5 h-full">
                                    {vizStage === null && (
                                        <div className="flex text-zinc-500 text-lg items-center justify-center">
                                            -
                                        </div>
                                    )}
                                    {vizStage === "keygen0" && <KeygenVisualization onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} colorDataPub={(Array.from(aliceKeys.publicKey)).slice(0, 64)} colorDataPriv={(Array.from(aliceKeys.secretKey)).slice(0, 64)} />}
                                    {vizStage === "keygen1" && <KeygenVisualizationProcess onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} />}
                                    {vizStage === "encapsulation0" && <EncapsulationVisualization onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} colorDataC={(Array.from(cipherText).slice(0, 4))} colorDataK={(Array.from(sharedSecret).slice(0, 4))} />}
                                    {vizStage === "encapsulation1" && <EncapsulationVisualizationProcess onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} />}
                                    {vizStage === "decapsulation0" && <DecapsulationVisualization onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} />}
                                    {vizStage === "decapsulation1" && <DecapsulationVisualizationProcess onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} />}
                                </div>
                            </main>
                            <div className="rounded-xl bg-white dark:bg-zinc-900 shadow-xl p-4 h-48">
                                {selectedVariable === null && (
                                    <div className="flex text-zinc-500 text-lg items-center justify-center">
                                    Try Key Generation and click Start Animation to see each step of ML-KEM animated!
                                    </div>
                                )}

                                {selectedVariable === "keygenBase0" && (
                                    <div className="flex text-zinc-500 text-base items-center justify-center">
                                    The key generation process is meant to generate an encapsulation key and a decapsulation key. 32 byte randomness d is used as input for K-PKE key generation, which outputs an encryption key and decryption key. The encryption key is used as the KEM encapsulation key (ek). The decryption key is appended with ek, the hash of ek, and 32 byte randomness z to create the decapsulation key (dk). Both are used to generate shared secret keys, while the encapsulation key acts as a public key.
                                    </div>
                                )}

                                {selectedVariable === "keygenBase1" && (
                                    <div className="flex text-zinc-500 text-base items-center justify-center">
                                    An encapsulation key and decryption key are generated using the CRYSTALS-Kyber scheme. The generated encapsulation key is the encryption key as is, while the decryption key is appended with the encapsulation key, a hash of the encapsulation key, and a random 32-byte value z to create the corresponding decapsulation key.
                                    </div>
                                )}

                                {selectedVariable === "keygenMatrixA" && (
                                    <div className="grid grid-rows-2 text-zinc-500 text-base">
                                        <div className="flex justify-center"><InlineMath math="A \in (\mathbb{Z}_q^{256})^{k \times k}" /></div>
                                        <div>Matrix A is generated from randomness <InlineMath math="\rho" /> extracted from <InlineMath math="d" /> with a set q and k depending on the chosen security level of ML-KEM. q is 3329 for all three levels, while k is 2, 3, and 4 for ML-KEM-512, ML-KEM-768, and ML-KEM-1024 respectively.</div>
                                    </div>
                                )}

                                {selectedVariable === "keygenMatrixS" && (
                                    <div className="grid grid-rows-2 gap-2 text-zinc-500 text-base">
                                        <div className="flex justify-center"><InlineMath math="s \in (\mathbb{Z}_q^{256})^{k}" /></div>
                                        s is a set of secret variables. It's multiplied with matrix A in the process to get t. Also encrypted to make the decryption key.
                                    </div>
                                )}

                                {selectedVariable === "keygenMatrixE" && (
                                    <div className="grid grid-rows-2 gap-2 text-zinc-500 text-base">
                                        <div className="flex justify-center"><InlineMath math="e \in (\mathbb{Z}_q^{256})^{k}" /></div>
                                        e is the noise vector. It's used to introduce more randomness and complexity to the key so that it's more secure.
                                    </div>
                                )}

                                {selectedVariable === "keygenMatrixT" && (
                                    <div className="text-zinc-500 text-base">
                                    The resulting t is encoded into byte arrays and appended with the seed of the A matrix, then returned as the encryption key. A modified Fujisaki-Okamoto transform is applied to complete the process.
                                    </div>
                                )}

                                {selectedVariable === "encapsulationBase0" && (
                                    <div className="text-zinc-500 text-base">
                                        The encapsulation process takes the generated encapsulation key, internally generates 32 byte randomness, and encrypts a plaintext message using both, creating ciphertext <InlineMath math="c" />. A shared secret key <InlineMath math="K" /> is derived from the encapsulation key.
                                    </div>
                                )}

                                {selectedVariable === "encapsulationBase1" && (
                                    <div className="text-zinc-500 text-base">
                                        A plaintext message is encrypted into ciphertext using an encryption key and randomness r through the K-PKE encryption algorithm.
                                    </div>
                                )}

                                {selectedVariable === "encapsMatrixAT" && (
                                    <div className="grid grid-rows-2 gap-2 text-zinc-500 text-base">
                                        <div className="flex justify-center"><InlineMath math="\hat{A} \in (\mathbb{Z}_q^{256})^{k \times k}" /></div>
                                        <div>Matrix A from the key generation stage is re-generated from the seed <InlineMath math="\rho" /> stored in the encryption/encapsulation key. It is then transposed and used to calculate <InlineMath math="u" />.</div>
                                    </div>
                                )}

                                {selectedVariable === "encapsMatrixY" && (
                                    <div className="grid grid-rows-2 gap-2 text-zinc-500 text-base">
                                        <div className="flex justify-center"><InlineMath math="y \in (\mathbb{R}_q^{k})" /></div>
                                        <div>Vector y is sampled from the centered binomial distribution using pseudorandomness expanded from the input randomness <InlineMath math="r \in (\mathbb{R}_q^{k})" />.</div>
                                    </div>
                                )}

                                {selectedVariable === "encapsMatrixE1" && (
                                    <div className="grid grid-rows-2 gap-2 text-zinc-500 text-base">
                                        <div className="flex justify-center"><InlineMath math="e_1 \in (\mathbb{R}_q^{k})" /></div>
                                        <div>Noise <InlineMath math="e_1" /> is sampled from the centered binomial distribution using pseudorandomness expanded from the input randomness <InlineMath math="r \in (\mathbb{R}_q^{k})" />.</div>
                                    </div>
                                )}

                                {selectedVariable === "encapsMatrixE2" && (
                                    <div className="grid grid-rows-2 gap-2 text-zinc-500 text-base">
                                        <div className="flex justify-center"><InlineMath math="e_2 \in (\mathbb{R}_q^{k})" /></div>
                                        <div>Noise <InlineMath math="e_2" /> is sampled from the centered binomial distribution using pseudorandomness expanded from the input randomness <InlineMath math="r \in (\mathbb{R}_q^{k})" />.</div>
                                    </div>
                                )}

                                {selectedVariable === "encapsMatrixU" && (
                                    <div className="text-zinc-500 text-base">
                                        <InlineMath math="u" /> is the first half of the raw ciphertext, calculated by multiplying matrix A with secret Y and adding noise <InlineMath math="e_1" /> to the result. This is then compressed and encoded back into raw bytes to form <InlineMath math="c_1" />.
                                    </div>
                                )}

                                {selectedVariable === "encapsMatrixT" && (
                                    <div className="grid grid-rows-2 gap-2 text-zinc-500 text-base">
                                        <div className="flex justify-center"><InlineMath math="t \in (\mathbb{Z}_q^{256})^{k}" /></div>
                                        <div>Vector <InlineMath math="t" /> is derived from the encryption key as a vector of polynomials, wherein bytes are 'decoded' into 12 bit integers.</div>
                                    </div>
                                )}

                                {selectedVariable === "encapsMatrixMu" && (
                                    <div className="text-zinc-500 text-base">
                                        <InlineMath math="\mu" /> is the result of decoding and decompressing the message <InlineMath math="m" />.
                                    </div>
                                )}

                                {selectedVariable === "encapsMatrixV" && (
                                    <div className="text-zinc-500 text-base">
                                        <InlineMath math="v" /> is the second half of the raw ciphertext, calculated by multiplying <InlineMath math="\hat{t}^{t}" /> with secret y and adding noise <InlineMath math="e_2" /> and <InlineMath math="\mu" /> to the result. This is then compressed and encoded back into raw bytes to form <InlineMath math="c_2" />.
                                    </div>
                                )}

                                {selectedVariable === "returnCiphertext" && (
                                    <div className="grid grid-rows-2 gap-2 text-zinc-500 text-base">
                                        <div className="flex justify-center"><InlineMath math="c \in \mathbb{B}^{32(d_u k + d_v)}" /></div>
                                        <div><InlineMath math="c_1" /> and <InlineMath math="c_2" /> are appended to form the full ciphertext.</div>
                                    </div>
                                )}

                                {selectedVariable === "decapsulationBase0" && (
                                    <div className="text-zinc-500 text-base">
                                        The decapsulation process uses decapsulation key dk to produce a shared secret key <InlineMath math="K'" /> from ciphertext <InlineMath math="c" />. Message <InlineMath math="m'" /> is the output of Kyber-PKE decrypt, and is concatenated with the hash <InlineMath math="h" /> of the PKE encryption key. <InlineMath math="K'" /> and randomness <InlineMath math="r'" /> are derived from the result. <InlineMath math="K'" /> is only accepted if the output of re-encrypting message <InlineMath math="m'" /> using the extracted PKE encryption key <InlineMath math="ek_{PKE}" /> and randomness <InlineMath math="r'" /> matches <InlineMath math="c" />.
                                    </div>
                                )}

                                {selectedVariable === "decapsulationBase1" && (
                                    <div className="text-zinc-500 text-base">
                                        The input ciphertext is decrypted into plaintext using the decryption key dk.
                                    </div>
                                )}

                                {selectedVariable === "cipherMatrixDecaps" && (
                                    <div className="grid grid-rows-2 gap-2 text-zinc-500 text-base">
                                        <div className="flex justify-center"><InlineMath math="c \in \mathbb{B}^{32(d_u k + d_v)}" /></div>
                                        <div>The input ciphertext <InlineMath math="c" /> is split into <InlineMath math="c_1" /> and <InlineMath math="c_2" />.</div>
                                    </div>
                                )}

                                {selectedVariable === "cipher1MatrixDecaps" && (
                                    <div className="text-zinc-500 text-base">
                                        The first half of ciphertext <InlineMath math="c" />, <InlineMath math="c_1" />, contains the encoded and compressed version of vector <InlineMath math="u" /> from the encapsulation stage.
                                    </div>
                                )}

                                {selectedVariable === "cipher2MatrixDecaps" && (
                                    <div className="text-zinc-500 text-base">
                                        The second half of ciphertext <InlineMath math="c" />, <InlineMath math="c_2" />, contains the encoded and compressed version of polynomial <InlineMath math="v" /> from the encapsulation stage.
                                    </div>
                                )}

                                {selectedVariable === "uMatrixDecaps" && (
                                    <div className="text-zinc-500 text-base">
                                        <InlineMath math="c_1" /> is decoded and decompressed into <InlineMath math="u'" />.
                                    </div>
                                )}

                                {selectedVariable === "vMatrixDecaps" && (
                                    <div className="text-zinc-500 text-base">
                                        <InlineMath math="c_2" /> is decoded and decompressed into <InlineMath math="v'" />.
                                    </div>
                                )}

                                {selectedVariable === "sMatrixDecaps" && (
                                    <div className="text-zinc-500 text-base">
                                        12 bit integer array s is decoded from the decryption key dk.
                                    </div>
                                )}

                                {selectedVariable === "decapsM" && (
                                    <div className="text-zinc-500 text-base">
                                        The constant term <InlineMath math="v" /> is calculated by multiplying <InlineMath math="\hat{s}^T" /> and <InlineMath math="u'" />. Subtracting that from <InlineMath math="v'" /> outputs the noisy message polynomial <InlineMath math="w" />, which is compressed and encoded into the plaintext byte array <InlineMath math="m" />.
                                    </div>
                                )}

                            </div>
                        </div>
                        <div className="p-6 sticky h-[calc(100vh-3rem)] flex flex-col gap-4">
                            <div className="rounded-xl bg-zinc-900 text-green-400 font-mono text-xs shadow-xl p-6 h-48 overflow-y-auto">
                                {output.length === 0 ? (
                                    <div className="text-zinc-500">...</div>
                                ) : (
                                    output.map((line, index) => (
                                        <div key={index}>{line}</div>
                                    ))
                                )}
                            </div>
                            <div className="overflow-y-auto flex flex-col gap-4 pr-2">
                                <div className="flex flex-col items-center gap-4 rounded-xl bg-white dark:bg-zinc-900 font-mono text-sm shadow-xl p-5">
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
                                <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-zinc-900 font-mono text-sm shadow-xl p-5 gap-y-4">
                                    <div className="flex flex-row gap-x-4">
                                        <Button
                                            variant="secondary"
                                            size="lg"
                                            onClick={() => executeMLKEM("Key Generation")}
                                        >
                                            Key Generation
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="lg"
                                            disabled={!aliceKeys}
                                            onClick={() => setVizStage("keygen0")}
                                        >
                                            Start Animation
                                        </Button>
                                    </div>
                                    <div className="flex flex-col gap-y-2 w-full">
                                        Public Key
                                        <div className="rounded-2xl bg-slate-100 dark:bg-zinc-900 p-3 h-40">
                                            <div className="overflow-y-auto rounded-xl bg-slate-200 dark:bg-zinc-800 p-4 h-full text-xs font-mono flex flex-col gap-2">
                                                {!aliceKeys ? (
                                                    <div className="text-zinc-500">No key generated</div>
                                                ) : (
                                                    <>
                                                        <div className="break-all">
                                                            {expandedPublicKey
                                                                ? formatArray(aliceKeys.publicKey)
                                                                : previewArray(aliceKeys.publicKey)}
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setExpandedPublicKey(!expandedPublicKey)}
                                                        >
                                                            {expandedPublicKey ? "Collapse" : "Expand"}
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-y-2 w-full">
                                        Secret Key
                                        <div className="rounded-lg bg-slate-100 dark:bg-zinc-900 p-3 h-48">
                                            <div className="overflow-y-auto rounded-xl bg-slate-200 dark:bg-zinc-800 p-4 h-full text-xs font-mono flex flex-col gap-2">

                                                {!aliceKeys ? (
                                                    <div className="text-zinc-500">No key generated</div>
                                                ) : (
                                                    <>
                                                        <div className="break-all">
                                                            {expandedSecretKey
                                                                ? formatArray(aliceKeys.secretKey)
                                                                : previewArray(aliceKeys.secretKey)}
                                                        </div>

                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setExpandedSecretKey(!expandedSecretKey)}
                                                        >
                                                            {expandedSecretKey ? "Collapse" : "Expand"}
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-zinc-900 font-mono text-sm shadow-xl p-5 gap-y-4">
                                    <div className="flex flex-row gap-x-4">
                                        <Button
                                            variant="secondary"
                                            size="lg"
                                            disabled={!aliceKeys}
                                            onClick={() => executeMLKEM("Encapsulation")}
                                        >
                                            Encapsulation
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="lg"
                                            disabled={!cipherText}
                                            onClick={() => setVizStage("encapsulation0")}
                                        >
                                            Start Animation
                                        </Button>
                                    </div>
                                    <div className="flex flex-col gap-y-2 w-full">
                                        <div className="flex flex-col gap-y-2 w-full">
                                            Cipher Text
                                            <div className="rounded-2xl bg-slate-100 dark:bg-zinc-900 p-3 h-48">
                                                <div className="overflow-y-auto rounded-xl bg-slate-200 dark:bg-zinc-800 p-4 h-full text-xs font-mono flex flex-col gap-2">
                                                    {!cipherText ? (
                                                        <div className="text-zinc-500">No ciphertext generated</div>
                                                    ) : (
                                                        <>
                                                            <div className="break-all">
                                                                {expandedCipherText
                                                                    ? formatArray(cipherText)
                                                                    : previewArray(cipherText)}
                                                            </div>

                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setExpandedCipherText(!expandedCipherText)}
                                                            >
                                                                {expandedCipherText ? "Collapse" : "Expand"}
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-y-2 w-full">
                                            Shared Secret
                                            <div className="rounded-lg bg-slate-100 dark:bg-zinc-900 p-3 h-48">
                                                <div className="overflow-y-auto rounded-xl bg-slate-200 dark:bg-zinc-800 p-4 h-full text-xs font-mono flex flex-col gap-2">

                                                    {!sharedSecret ? (
                                                        <div className="text-zinc-500">No secret generated</div>
                                                    ) : (
                                                        <>
                                                            <div className="break-all">
                                                                {expandedSharedSecret
                                                                    ? formatArray(sharedSecret)
                                                                    : previewArray(sharedSecret)}
                                                            </div>

                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setExpandedSharedSecret(!expandedSharedSecret)}
                                                            >
                                                                {expandedSharedSecret ? "Collapse" : "Expand"}
                                                            </Button>
                                                        </>
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-zinc-900 font-mono text-sm shadow-xl p-5 gap-y-4">
                                    <div className="flex flex-row gap-x-4">
                                        <Button
                                            variant="secondary"
                                            size="lg"
                                            disabled={!cipherText}
                                            onClick={() => executeMLKEM("Decapsulation")}
                                        >
                                            Decapsulation
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="lg"
                                            disabled={!sharedSecret}
                                            onClick={() => setVizStage("decapsulation0")}
                                        >
                                            Start Animation
                                        </Button>
                                    </div>
                                    <div className="flex flex-col gap-y-2 w-full">
                                        Decapsulated Secret
                                        <div className="rounded-lg bg-slate-100 dark:bg-zinc-900 p-3 h-48">
                                            <div className="overflow-y-auto rounded-xl bg-slate-200 dark:bg-zinc-800 p-4 h-full text-xs font-mono flex flex-col gap-2">

                                                {!decapsulatedSecret ? (
                                                    <div className="text-zinc-500">No key generated</div>
                                                ) : (
                                                    <>
                                                        <div className="break-all">
                                                            {expandedDecapsulatedSecret
                                                                ? formatArray(decapsulatedSecret)
                                                                : previewArray(decapsulatedSecret)}
                                                        </div>

                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setExpandedDecapsulatedSecret(!expandedDecapsulatedSecret)}
                                                        >
                                                            {expandedDecapsulatedSecret ? "Collapse" : "Expand"}
                                                        </Button>
                                                    </>
                                                )}

                                            </div>
                                        </div>
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