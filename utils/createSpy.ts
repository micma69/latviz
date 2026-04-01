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
    r: Uint8Array;
    z: Uint8Array;
    c1: Uint8Array;
    c2: Uint8Array;
    u: Uint16Array[];
    v: Uint16Array;
    sHat: Uint16Array[];
    w: Uint16Array;
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