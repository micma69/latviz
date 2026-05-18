export interface KeygenSpyData {
    d: Uint8Array;
    z: Uint8Array;
    rho: Uint8Array;
    sigma: Uint8Array;
    A: Uint16Array[][];
    sHat: Uint16Array[];
    eHat: Uint16Array[];
    tHat: Uint16Array[];
    ekPKE: Uint8Array;
    dkPKE: Uint8Array;
    publicKey: number[];
    secretKey: number[];
}

export interface EncapsSpyData {
    ek: Uint8Array;
    m: Uint8Array;
    K: Uint8Array;
    r: Uint8Array;
    rho: Uint8Array;
    tHat: Uint16Array[];
    A: Uint16Array[][];
    y: Uint16Array[];
    e1: Uint16Array[];
    u: Uint16Array[];
    e2: Uint16Array;
    mu: Uint16Array;
    v: Uint16Array;
    c1: Uint8Array;
    c2: Uint8Array;
    cipherText: number[];
    sharedSecret: number[];
}

export interface DecapsSpyData {
    dk: Uint8Array;
    c: Uint8Array;
    m: Uint8Array;
    h: Uint8Array;
    K: Uint8Array;
    Kbar: Uint8Array;
    Kfinal: Uint8Array;
    r: Uint8Array;
    z: Uint8Array;
    c1: Uint8Array;
    c2: Uint8Array;
    u: Uint16Array[];
    v: Uint16Array;
    sHat: Uint16Array[];
    w: Uint16Array;
    ekPKE: Uint8Array;
    dkPKE: Uint8Array; 
}

export interface Spy {
    keygen: Partial<KeygenSpyData>;
    encaps: Partial<EncapsSpyData>;
    decaps: Partial<DecapsSpyData>;
    notify: (stage: 'keygen' | 'encaps' | 'decaps') => void;
    subscribe: (fn: (stage: 'keygen' | 'encaps' | 'decaps', spy: Spy) => void) => () => void;
    reset: () => void;
}

export function createSpy(): Spy {
    const listeners = new Set<(stage: 'keygen' | 'encaps' | 'decaps', spy: Spy) => void>();
    const spy: Spy = {
        keygen: {},
        encaps: {},
        decaps: {},
        notify(stage) {
            listeners.forEach(fn => fn(stage, spy));
        },
        subscribe(fn) {
            listeners.add(fn);
            return () => listeners.delete(fn);
        },
        reset() {
            spy.keygen = {};
            spy.encaps = {};
            spy.decaps = {};
        }
    };
    return spy;
}

export interface DSAKeygenSpyData {
    seed: Uint8Array;
    rho: Uint8Array;
    rhoPrime: Uint8Array;
    K: Uint8Array;
    s1: Int32Array[];
    s2: Int32Array[];
    t: Int32Array[];
    t0: Int32Array[];
    t1: Int32Array[];
    tr: Uint8Array;
    pk: Uint8Array;
    sk: Uint8Array;
    A: Uint16Array[][];
}

export interface SignIteration {
    kappa: number;
    rejected: boolean;
    accepted: boolean;
    reason?: string;
    y?: Int32Array[];
    w?: Int32Array[];
    w1?: Int32Array[];
    cTilde?: Uint8Array;
    c?: Int32Array;
    z?: Int32Array[];
    zNormInf?: number;
    r0?: Int32Array[];
    r0NormInf?: number;
    ct0?: Int32Array[];
    ct0NormInf?: number;
    h?: Uint8Array[];
    hammingWeight?: number;
}

export interface DSASignSpyData {
    ctx?: Uint8Array;
    rho: Uint8Array;
    K: Uint8Array;
    s1: Int32Array[];
    s2: Int32Array[];
    t0: Int32Array[];
    tr: Uint8Array;
    mu: Uint8Array;
    rhoPrime: Uint8Array;
    rnd: Uint8Array;
    A: Int32Array[][];
    iterations?: SignIteration[];
    y?: Int32Array[];
    w?: Int32Array[];
    w1?: Int32Array[];
    c?: Int32Array;
    z?: Int32Array[];
    r0?: Int32Array[];
    ct0?: Int32Array[];
    h?: Uint8Array[];
    kappa?: number;
    s1Hat?: Int32Array[];
    s2Hat?: Int32Array[];
    t0Hat?: Int32Array[];
    signature?: Uint8Array;
    pk?: Uint8Array;
    sk?: Uint8Array;
    msg?: Uint8Array;
    M?: Uint8Array;
    random?: Uint8Array;
    cTilde?: Uint8Array;
}

export interface DSAVerifySpyData {
    mu: Uint8Array;
    rho: Uint8Array;
    cTilde: Uint8Array;
    c: Uint16Array;
    z: Uint16Array[];
    w1: Uint16Array[];
    h: Uint8Array[];
    c2: Uint8Array;
    result: boolean;
    pk: Uint8Array;
    signature: Uint8Array;
    msg: Uint8Array;
    M: Uint8Array;
    ctx: Uint8Array;
    t1: Uint16Array[];
    A: Int32Array[][];           // Fix: was Uint16Array
    ct12d: Int32Array[];         // Fix: was Uint16Array
    Az: Int32Array[];            // Fix: was Uint16Array
    wPrime: Int32Array[];        // Fix: was Uint16Array
    zNtt: Int32Array[];          // Fix: was Uint16Array
    tr: Uint8Array; 
}

export interface DSASpy {
    keygen: Partial<DSAKeygenSpyData>;
    sign: Partial<DSASignSpyData>;
    verify: Partial<DSAVerifySpyData>;
    notify: (stage: 'keygen' | 'sign' | 'verify') => void;
    subscribe: (fn: (stage: 'keygen' | 'sign' | 'verify', spy: DSASpy) => void) => () => void;
    reset: () => void;
}

export function createDSASpy(): DSASpy {
    const listeners = new Set<(stage: 'keygen' | 'sign' | 'verify', spy: DSASpy) => void>();
    const spy: DSASpy = {
        keygen: {},
        sign: {},
        verify: {},
        notify(stage) { listeners.forEach(fn => fn(stage, spy)); },
        subscribe(fn) {
            listeners.add(fn);
            return () => listeners.delete(fn);
        },
        reset() {
            spy.keygen = {};
            spy.sign = {};
            spy.verify = {};
        }
    };
    return spy;
}
