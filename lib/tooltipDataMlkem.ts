export const tooltipData = {
  d: {
    title: "Seed d",
    description: "Random 32 byte seed that determinilistically generates the key pair.",
    details: "Starting randomness used to generate both the public matrix and secret noise values via ρ and σ.",
  },

  z_keygen: {
    title: "Seed z",
    description: "Secret seed used during decapsulation to safely handle invalid ciphertext",
    details: "Used to derive a replacement shared secret K on failure, making a successful or failed decapsulation indistinguishable.",
  },

  rho_keygen: {
    title: "Seed ρ",
    description: "Public seed used to deterministically generate matrix A.",
    details: "Derived from d and shared as part of the public key.",
  },

  sigma_keygen: {
    title: "Seed σ",
    description: "Secret seed used to sample the noise vectors s and e.",
    details: "Produces the small random values required for lattice security.",
  },

  A_keygen: {
    title: "Matrix A",
    description: "Public matrix used in lattice-based key generation.",
    details: "Deterministically expanded from seed ρ.",
  },

  s_keygen: {
    title: "Secret vector s",
    description: "Small secret polynomial vector forming the private key.",
    details: "Sampled from σ using bounded random noise.",
  },

  e_keygen: {
    title: "Error vector e",
    description: "Small random noise added during public key generation.",
    details: "Helps hide the secret vector s within lattice computations.",
  },

  t_keygen: {
    title: "Public vector t",
    description: "Public key polynomial vector computed from A, s, and e.",
    details: "Represents the noisy lattice product A·s + e.",
  },

  ekPKE_keygen: {
    title: "Encryption key",
    description: "Encoded public key used for encryption.",
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
    details: "Includes the decryption key, public key copy, hashes, and fallback seed z.",
  },

  m_encaps: {
    title: "Message seed m",
    description: "Random value used to derive the shared secret and encryption randomness.",
    details: "Combined with the public key hash during encapsulation.",
  },

  K_encaps: {
    title: "Shared secret K",
    description: "Secret value established between both parties.",
    details: "Derived from m and used as the final shared key material.",
  },

  r_encaps: {
    title: "Randomness r",
    description: "Ephemeral randomness used during encryption.",
    details: "Drives sampling of temporary noise values.",
  },

  rho_encaps: {
    title: "Seed ρ",
    description: "Public seed used to reconstruct matrix A.",
    details: "Extracted from the encapsulation key.",
  },

  t_encaps: {
    title: "Public vector t",
    description: "Public lattice value used during encryption.",
    details: "Part of the recipient's encapsulation key.",
  },

  mu_encaps: {
    title: "Encoded message μ",
    description: "Message represented as polynomial coefficients.",
    details: "Embedded into the ciphertext during encryption.",
  },

  A_encaps: {
    title: "Matrix A",
    description: "Public matrix reconstructed from seed ρ.",
    details: "Used to generate the ciphertext components.",
  },

  y_encaps: {
    title: "Ephemeral vector y",
    description: "Temporary secret vector generated during encryption.",
    details: "Sampled from randomness r using small bounded noise values.",
  },

    e1_encaps: {
    title: "Error vector e₁",
    description: "Small random noise added to ciphertext component u.",
    details: "Helps hide the ephemeral lattice computations.",
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
    title: "Compressed u",
    description: "Compressed form of ciphertext component u.",
    details: "Stored to reduce ciphertext size.",
  },

  c2_encaps: {
    title: "Compressed v",
    description: "Compressed form of ciphertext component v.",
    details: "Contains the hidden encoded message.",
  },

  ciphertext_encaps: {
    title: "Ciphertext",
    description: "Encrypted data sent to the recipient.",
    details: "Formed by combining compressed components c₁ and c₂.",
  },

  ciphertext_decaps: {
    title: "Verification Data",
    description: "Values used during signature verification",
    details: "Includes hash values and polynomial coefficients",
  },

  decapskey_decaps: {
    title: "Verification Data",
    description: "Values used during signature verification",
    details: "Includes hash values and polynomial coefficients",
  },

  ekPKE_decaps: {
    title: "Verification Data",
    description: "Values used during signature verification",
    details: "Includes hash values and polynomial coefficients",
  },

  dkPKE_decaps: {
    title: "Verification Data",
    description: "Values used during signature verification",
    details: "Includes hash values and polynomial coefficients",
  },

  h_decaps: {
    title: "Public key hash h",
    description: "Hash of the encapsulation key.",
    details: "Used when re-deriving encapsulation values during decapsulation.",
  },

  z_decaps: {
    title: "Verification Data",
    description: "Values used during signature verification",
    details: "Includes hash values and polynomial coefficients",
  },

  c1_decaps: {
    title: "Verification Data",
    description: "Values used during signature verification",
    details: "Includes hash values and polynomial coefficients",
  },

  c2_decaps: {
    title: "Verification Data",
    description: "Values used during signature verification",
    details: "Includes hash values and polynomial coefficients",
  },

  u_decaps: {
    title: "Verification Data",
    description: "Values used during signature verification",
    details: "Includes hash values and polynomial coefficients",
  },

  v_decaps: {
    title: "Verification Data",
    description: "Values used during signature verification",
    details: "Includes hash values and polynomial coefficients",
  },

  s_decaps: {
    title: "Verification Data",
    description: "Values used during signature verification",
    details: "Includes hash values and polynomial coefficients",
  },

  w_decaps: {
    title: "Verification Data",
    description: "Values used during signature verification",
    details: "Includes hash values and polynomial coefficients",
  },

  m_decaps: {
    title: "Verification Data",
    description: "Values used during signature verification",
    details: "Includes hash values and polynomial coefficients",
  },

  Kp_decaps: {
    title: "Verification Data",
    description: "Values used during signature verification",
    details: "Includes hash values and polynomial coefficients",
  },

  rp_decaps: {
    title: "Verification Data",
    description: "Values used during signature verification",
    details: "Includes hash values and polynomial coefficients",
  },
  
  kbar_decaps: {
    title: "Fallback secret K̄",
    description: "Replacement shared secret candidate.",
    details: "Derived from z if ciphertext validation fails.",
  },

  cp_decaps: {
    title: "Verification Data",
    description: "Values used during signature verification",
    details: "Includes hash values and polynomial coefficients",
  },

  kfinal: {
    title: "Final shared secret",
    description: "Shared key returned after decapsulation checks.",
    details: "Chosen from K′ or K̄ depending on ciphertext validity.",
  },

  default: {
    title: "DEFAULTDEFAULTDEFAULT",
    description: "Coefficient visualization",
    details: "Each cell shows a polynomial coefficient value",
  }
} as const;

export type TooltipType = keyof typeof tooltipData;