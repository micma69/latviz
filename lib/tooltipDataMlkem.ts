export const tooltipData = {
  d: {
    title: "Seed d",
    description: "Random 32 byte seed that determinilistically generates the key pair.",
    details: "Starting randomness used to generate both the public matrix and secret noise values via ρ and σ.",
  },

  z_keygen: {
    title: "Seed z",
    description: "Secret 32 byte seed used during decapsulation to safely handle invalid ciphertext.",
    details: "Used to derive a replacement shared secret K on failure, making a successful or failed decapsulation indistinguishable.",
  },

  rho_keygen: {
    title: "Seed ρ",
    description: "Public 32 byte seed used to deterministically generate matrix A.",
    details: "Derived from d and shared as part of the encryption key.",
  },

  sigma_keygen: {
    title: "Seed σ",
    description: "Secret 32 byte seed used to sample the noise vectors s and e.",
    details: "Produces the small random values required for lattice security.",
  },

  A_keygen: {
    title: "Matrix A",
    description: "Public matrix used in lattice-based key generation.",
    details: "Deterministically expanded from seed ρ.",
  },

  s_keygen: {
    title: "Secret vector s",
    description: "Small secret polynomial vector for forming the private key.",
    details: "Sampled from σ using bounded random noise.",
  },

  e_keygen: {
    title: "Error vector e",
    description: "Small random noise added during encryption key generation.",
    details: "Helps hide the secret vector s within lattice computations.",
  },

  t_keygen: {
    title: "Public vector t",
    description: "Encryption key polynomial vector computed from A, s, and e.",
    details: "Represents the noisy lattice product A·s + e used in making the encryption key.",
  },

  ekPKE_keygen: {
    title: "Encryption key",
    description: "Encoded key used for encryption. Also known as the public key.",
    details: "Contains the public vector t and seed ρ.",
  },

  dkPKE_keygen: {
    title: "Decryption key",
    description: "Encoded secret key used for decryption.",
    details: "Contains the secret vector s.",
  },

  encapskey_keygen: {
    title: "Encapsulation key",
    description: "Public ML-KEM key used to encapsulate shared secrets.",
    details: "Built from the encryption key and auxiliary public data.",
  },

  decapskey_keygen: {
    title: "Decapsulation key",
    description: "Secret ML-KEM key used to recover shared secrets.",
    details: "Includes the decryption key, a copy of the encryption key and its hash, and fallback seed z.",
  },

  encapskey_encaps: {
    title: "Encapsulation key",
    description: "Public ML-KEM key used to encapsulate shared secrets.",
    details: "Hashed and combined with m to derive K and r.",
  },

  m_encaps: {
    title: "Message seed m",
    description: "Random value used to derive the shared secret K and encryption randomness.",
    details: "Combined with the encryption key hash during encapsulation.",
  },

  K_encaps: {
    title: "Shared secret K",
    description: "Secret value established between both parties.",
    details: "Derived from m and used as the final shared key material.",
  },

  r_encaps: {
    title: "Randomness r",
    description: "Randomness used during encryption.",
    details: "Drives sampling of temporary noise values y, e₁, and e₂.",
  },

  rho_encaps: {
    title: "Seed ρ",
    description: "Public seed used to reconstruct matrix A.",
    details: "Extracted from the encapsulation key, from the last 32 bytes of ekₚₖₑ.",
  },

  t_encaps: {
    title: "Public vector t",
    description: "Public lattice value used during encryption.",
    details: "Part of the recipient's encapsulation key, decoded from the first 384*k bytes of ekₚₖₑ.",
  },

  mu_encaps: {
    title: "Encoded message μ",
    description: "Message m represented as polynomial coefficients.",
    details: "Embedded into the ciphertext during encryption.",
  },

  A_encaps: {
    title: "Matrix A",
    description: "Public matrix reconstructed from seed ρ.",
    details: "Used to generate the ciphertext components. Should be the same as matrix A in Key Generation.",
  },

  y_encaps: {
    title: "Vector y",
    description: "Temporary secret vector generated during encryption.",
    details: "Sampled from randomness r using small bounded noise values. 'Mixes' into the the encryption key",
  },

  e1_encaps: {
    title: "Error vector e₁",
    description: "Noise added to ciphertext component u.",
    details: "Helps hide lattice computation A·y.",
  },

  e2_encaps: {
    title: "Error polynomial e₂",
    description: "Noise added to ciphertext component v.",
    details: "Protects the embedded message μ.",
  },

  u_encaps: {
    title: "Ciphertext component u",
    description: "First lattice component of the ciphertext.",
    details: "Computed from Aᵀ·y + e₁.",
  },

  v_encaps: {
    title: "Ciphertext component v",
    description: "Second ciphertext component containing the encoded message.",
    details: "Computed from tᵀ·y + e₂ + μ.",
  },

  c1_encaps: {
    title: "Ciphertext component c₁",
    description: "Compressed form of ciphertext component u.",
    details: "Stored to reduce ciphertext size.",
  },

  c2_encaps: {
    title: "Ciphertext component c₂",
    description: "Compressed form of ciphertext component v.",
    details: "Contains the hidden encoded message.",
  },

  ciphertext_encaps: {
    title: "Ciphertext",
    description: "Encrypted data sent to the recipient.",
    details: "Formed by combining compressed components c₁ and c₂.",
  },

  ciphertext_decaps: {
    title: "Ciphertext",
    description: "Encrypted data received by the recipient.",
    details: "Splits back into components c₁ and c₂.",
  },

  decapskey_decaps: {
    title: "Decapsulation key",
    description: "Secret ML-KEM key used to recover the shared secret.",
    details: "Contains the secret key, public key copy, hashes, and fallback seed z.",
  },

  ekPKE_decaps: {
    title: "Encryption key",
    description: "Public encryption key extracted from the decapsulation key.",
    details: "Used to re-encrypt and validate the received ciphertext.",
  },

  dkPKE_decaps: {
    title: "Decryption key",
    description: "Used to decrypt the ciphertext.",
    details: "Contains the secret vector s used to recover the message.",
  },

  h_decaps: {
    title: "Public key hash h",
    description: "Hash of the encapsulation key.",
    details: "Used when re-deriving encapsulation values during decapsulation.",
  },

  z_decaps: {
    title: "Fallback seed z",
    description: "Fallback seed used if ciphertext validation fails.",
    details: "Prevents attackers from distinguishing successful and failed decapsulation by deriving a replacement shared secret.",
  },

  c1_decaps: {
    title: "Ciphertext component c₁",
    description: "The first 32*dᵤ*k bytes of the ciphertext.",
    details: "Decompressed into ciphertext component u.",
  },

  c2_decaps: {
    title: "Ciphertext component c₂",
    description: "The rest of the ciphertext.",
    details: "Contains the hidden encoded message. Is decompressed into ciphertext component v.",
  },

  u_decaps: {
    title: "Ciphertext component u",
    description: "First decompressed component of the ciphertext.",
    details: "Used with the decryption key to recover the encoded message.",
  },

  v_decaps: {
    title: "Ciphertext component v",
    description: "Second decompressed component of the ciphertext.",
    details: "Contains the encoded message mixed with lattice noise.",
  },

  s_decaps: {
    title: "Secret vector s",
    description: "Secret vector used for decryption.",
    details: "Decoded from the decryption key.",
  },

  w_decaps: {
    title: "Polynomial w",
    description: "An approximation of the encoded message polynomial.",
    details: "Computed from v − (sᵀ · u).",
  },

  m_decaps: {
    title: "Recovered message m",
    description: "Message recovered from the decrypted ciphertext.",
    details: "Used to reconstruct the encapsulation process.",
  },

  Kp_decaps: {
    title: "Candidate shared secret K′",
    description: "Shared secret candidate derived from the recovered message.",
    details: "Accepted only if ciphertext validation succeeds.",
  },

  rp_decaps: {
    title: "Randomness r′",
    description: "Encryption randomness reconstructed during decapsulation.",
    details: "Used to recreate the ciphertext.",
  },
  
  kbar_decaps: {
    title: "Fallback secret K̄",
    description: "Replacement shared secret candidate.",
    details: "Derived from z if ciphertext validation fails. Prevents attackers from distinguishing successful and failed decapsulation by hiding decapsulation failures.",
  },

  cp_decaps: {
    title: "Reconstructed ciphertext c′",
    description: "Ciphertext regenerated from m and r′.",
    details: "Compared against the received ciphertext for validation.",
  },

  kfinal: {
    title: "Final shared secret",
    description: "Shared key returned after decapsulation checks.",
    details: "Chosen based on ciphertext validity. K̄ is set as the new K′ if not valid, stays as K′ otherwise.",
  },

  default: {
    title: "THIS IS AN ERROR MESSAGE",
    description: "SOMETHING IS WRONG",
    details: "DEFAULT",
  }
} as const;

export type TooltipType = keyof typeof tooltipData;