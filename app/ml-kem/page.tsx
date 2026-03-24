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
        }
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
        <div className="grid min-h-screen grid-cols-1 md:grid-cols-[2.5fr_1.5fr] gap-6 bg-zinc-200 p-6 dark:bg-black">
            <div className="flex flex-col gap-4">
                <Link href="/">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-fit text-sm"
                    >
                        ← Back
                    </Button>
                </Link>
                <main className="flex-1 rounded-xl bg-white dark:bg-zinc-900 shadow-xl p-5">
                    <div className="rounded-xl bg-slate-100 dark:bg-zinc-900 p-5 h-full">
                        {vizStage === null && (
                            <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
                                Select an animation
                            </div>
                        )}

                        {vizStage === "keygen0" && <KeygenVisualization onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} />}
                        {vizStage === "keygen1" && <KeygenVisualizationProcess onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} />}
                        {vizStage === "encapsulation0" && <EncapsulationVisualization onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} />}
                        {vizStage === "encapsulation1" && <EncapsulationVisualizationProcess onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} />}
                        {vizStage === "decapsulation0" && <DecapsulationVisualization onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} />}
                        {vizStage === "decapsulation1" && <DecapsulationVisualizationProcess onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} />}
                    </div>
                </main>
                <div className="rounded-xl bg-white dark:bg-zinc-900 shadow-xl p-4 h-48">
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
                        <div className="grid grid-rows-2 gap-2 text-zinc-500 text-base">
                            <div className="flex justify-center"><InlineMath math="A \in (\mathbb{Z}_q^{256})^{k \times k}" /></div>
                            Matrix A is generated from randomness with a set q and k depending on the chosen security level of ML-KEM. q is 3329 for all three levels, while k is 2, 3, and 4 for ML-KEM-512, ML-KEM-768, and ML-KEM-1024 respectively.
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
                            The decapsulation process uses decapsulation key dk to produce a shared secret key <InlineMath math="K'" /> from ciphertext <InlineMath math="c" />. <InlineMath math="K'" /> is only accepted if the output of re-encrypting message <InlineMath math="m'" /> using the extracted PKE encryption key <InlineMath math="ek_{PKE}" /> and randomness <InlineMath math="r'" /> matches <InlineMath math="c" />.
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

                    {selectedVariable === "decapsM" && (
                        <div className="text-zinc-500 text-base">
                            The constant term <InlineMath math="v" /> is calculated by multiplying <InlineMath math="s^T" /> and <InlineMath math="u'" />. Subtracting that from <InlineMath math="v'" /> outputs the noisy message polynomial <InlineMath math="w" />, which is compressed and encoded into the plaintext byte array <InlineMath math="m" />.
                        </div>
                    )}

                </div>
            </div>
            <div className="p-6 sticky top-6 h-[calc(100vh-3rem)] flex flex-col gap-4">
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
                                disabled={!aliceKeys}
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
                                disabled={!cipherText}
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
    );
}