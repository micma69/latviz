export const tooltipData = {
  xi_keygen: {
    title: "Seed ξ",
    description: "32 byte random seed used to generate the ML-DSA key pair.",
    details: "Hashed with 1 byte encoding each of k and ℓ, then expanded into ρ, ρ′, and secret key material K.",
  },

  rho_keygen: {
    title: "Seed ρ",
    description: "Public 32 byte seed used to deterministically generate matrix A.",
    details: "Included in the both the public and secret key.",
  },

  rhop_keygen: {
    title: "Seed ρ′",
    description: "Secret 32 byte seed used to sample the short vectors s₁ and s₂.",
    details: "Produces bounded noise values for lattice security.",
  },

  K_keygen: {
    title: "Secret seed K",
    description: "Secret random seed used during signing.",
    details: "Helps derive signing randomness.",
  },

  A_keygen: {
    title: "Matrix A",
    description: "Public matrix used in lattice computations.",
    details: "Generated deterministically from seed ρ.",
  },

  s1_keygen: {
    title: "Secret vector s₁",
    description: "Primary short secret vector used for signing.",
    details: "Sampled from small coefficients bounded between −𝜂 and 𝜂.",
  },

  s2_keygen: {
    title: "Secret vector s₂",
    description: "Secondary short secret vector used during verification equations.",
    details: "Sampled from small coefficients bounded between −𝜂 and 𝜂.Helps hide the secret structure of the signature.",
  },

  t_keygen: {
    title: "Vector t",
    description: "Public lattice vector derived from A and s₁.",
    details: "Represents the noisy lattice product A·s₁ + s₂.",
  },

  t0_keygen: {
    title: "Low bits t₀",
    description: "Low-order portion of vector t stored in the secret key.",
    details: "Used during signing and kept private.",
  },

  t1_keygen: {
    title: "High bits t₁",
    description: "High-order portion of vector t stored in the public key.",
    details: "Used during signature verification.",
  },

  publickey: {
    title: "Public key",
    description: "Public data used to verify signatures.",
    details: "Contains seed ρ and compressed vector t₁.",
  },

  secretkey: {
    title: "Secret key",
    description: "Private data used to generate signatures.",
    details: "Contains seeds ρ and K, hash tr, secret vectors s₁ and s₂, and t₀.",
  },

  tr_keygen: {
    title: "Hash tr",
    description: "Hash of the public key.",
    details: "Used when constructing message digests for signing.",
  },

  message_sign: {
    title: "Message M",
    description: "Original message being signed.",
    details: "Combined with hashes and context data during signing.",
  },

  rnd_sign: {
    title: "Randomness rnd",
    description: "Optional signing randomness.",
    details: "Provides extra entropy for randomized signing. If not used, substituted fully with zeros.",
  },

  ctx_sign: {
    title: "Context",
    description: "Optional domain-separation context string.",
    details: "Prevents signatures from being reused across protocols. Not currently being used.",
  },

  ctx_length: {
    title: "Context length",
    description: "Length of the context string in bytes.",
    details: "Encoded into the formatted verification message.",
  },

  M_sign: {
    title: "Message M",
    description: "Original message being signed.",
    details: "Combined with hashes and context data during signing.",
  },

  Mp_sign: {
    title: "Formatted message M′",
    description: "Encoded message input used during signing.",
    details: "Includes a single byte zero, context length, context, and the message bytes.",
  },

  rho_sign: {
    title: "Seed ρ",
    description: "Seed used to reconstruct matrix A.",
    details: "Extracted from the secret key.",
  },

  K_sign: {
    title: "Secret seed K",
    description: "Secret diversification seed used during signing.",
    details: "Extracted from the secret key and combined with μ to derive signing randomness.",
  },

  tr_sign: {
    title: "Hash tr",
    description: "Hash of the public key.",
    details: "Extracted from the secret key and used for when constructing message digests for signing.",
  },

  s1_sign: {
    title: "Secret vector s₁",
    description: "Primary short secret vector used for signing.",
    details: "Extracted from the secret key. Used in the signing generation loop.",
  },

  s2_sign: {
    title: "Secret vector s₂",
    description: "Secondary short secret vector used during verification equations.",
    details: "Extracted from the secret key. Used in the signing generation loop.",
  },

  t0_sign: {
    title: "Low bits t₀",
    description: "Low-order portion of vector t stored in the secret key.",
    details: "Extracted from the secret key. Used during signing and kept private.",
  },

  A_sign: {
    title: "Matrix A",
    description: "Public matrix reconstructed from seed ρ.",
    details: "Used in the signing generation loop.",
  },

  mu_sign: {
    title: "Digest μ",
    description: "Hash digest representing the message being signed.",
    details: "Used to derive the signature challenge.",
  },

  rhop_sign: {
    title: "Seed ρ′′",
    description: "Signing seed used to generate temporary masking vectors.",
    details: "Hash K, optional randomness, and μ.",
  },

  y_loop: {
    title: "Masking vector y",
    description: "Temporary random vector used to hide the secret key during signing.",
    details: "Sampled using seed ρ′′ such that each polynomial has coefficients between −𝛾1 + 1 and 𝛾1.",
  },

  w_loop: {
    title: "Vector w",
    description: "Lattice result computed from A·y.",
    details: "Later decomposed to derive the signature challenge.",
  },

  w1_loop: {
    title: "High bits w₁",
    description: "High-order bits extracted from vector w.",
    details: "Used to derive the challenge hash.",
  },

  tildec_loop: {
    title: "Challenge hash c̃",
    description: "Hash-derived challenge value.",
    details: "Generated from a hash of μ and the high bits w₁ of length 𝜆/4 bytes.",
  },

  c_loop: {
    title: "Challenge polynomial c",
    description: "Polynomial challenge derived from c̃.",
    details: "Used in the final signature equation. Sampled with coefficients from {-1, 0, 1}.",
  },

  z_sign: {
    title: "Response vector z",
    description: "Masked signing response included in the signature.",
    details: "Computed from y + c·s₁.",
  },

  r0_sign: {
    title: "Low bits r₀",
    description: "Low-order bits used during signature validation checks.",
    details: "Ensures the signature remains within allowed bounds. Will not be displayed is z is rejected beforehand.",
  },

  signature: {
    title: "Signature",
    description: "Cryptographic proof that the message was signed by the secret key holder.",
    details: "Contains the challenge, response vector z, and hint bits h.",
  },

  message_verify: {
    title: "Message",
    description: "Original message whose signature is being verified.",
    details: "Combined with context data and hashes during verification.",
  },

  publickey_verify: {
    title: "Public key",
    description: "Public ML-DSA key used to verify the signature.",
    details: "Contains the matrix seed ρ and compressed vector t₁.",
  },

  rho_verify: {
    title: "Seed ρ",
    description: "Public seed used to regenerate matrix A.",
    details: "Extracted from the public key during verification.",
  },

  t1_verify: {
    title: "High bits t₁",
    description: "Compressed public lattice vector stored in the public key.",
    details: "Used in the verification equation A·z − c·t₁.",
  },

  ctx_verify: {
    title: "Context",
    description: "Optional domain-separation context string.",
    details: "Ensures signatures are bound to a specific protocol or application. Not being used here.",
  },

  ctx_length_verify: {
    title: "Context length",
    description: "Length of the context string in bytes.",
    details: "Encoded into the formatted verification message.",
  },

  M_verify: {
    title: "Formatted message M",
    description: "Original message whose signature is being verified.",
    details: "Combined with context data and hashes during verification.",
  },

  Mp_verify: {
    title: "Formatted message M′",
    description: "Encoded message input used during verification.",
    details: "Contains the context length, context string, and message bytes.",
  },

  A_verify: {
    title: "Matrix A",
    description: "Public matrix reconstructed from seed ρ.",
    details: "Used in the signature verification equation.",
  },

  tr_verify: {
    title: "Hash tr",
    description: "Hash of the public key.",
    details: "Included in the message digest construction.",
  },

  mu_verify: {
    title: "Digest μ",
    description: "Hash digest representing the signed message.",
    details: "Used to recompute the signature challenge.",
  },

  tildec_verify: {
    title: "Challenge hash c̃",
    description: "Challenge value extracted from the signature.",
    details: "Expanded into the sparse challenge polynomial c.",
  },

  c_verify: {
    title: "Challenge polynomial c",
    description: "Polynomial reconstructed from c̃.",
    details: "Used in the verification equation.",
  },

  z_verify: {
    title: "Response vector z",
    description: "Masked response vector included in the signature.",
    details: "Checked to ensure coefficients remain within allowed bounds.",
  },

  h_verify: {
    title: "Hint vector h",
    description: "Compact correction hints included in the signature.",
    details: "Helps reconstruct the correct high bits during verification.",
  },

  wapprox: {
    title: "Approximate vector w′",
    description: "Lattice value reconstructed during verification.",
    details: "Computed from A·z − c·t₁.",
  },

  wp1: {
    title: "High bits w₁′",
    description: "Recovered high-order bits of the reconstructed vector.",
    details: "Used to recompute the challenge hash.",
  },

  tildecp_verify: {
    title: "Recomputed challenge c̃′",
    description: "Challenge hash recomputed from μ and w₁′.",
    details: "Must match the original c̃ for the signature to verify.",
  },

  default: {
    title: "THIS IS AN ERROR MESSAGE",
    description: "SOMETHING IS WRONG",
    details: "DEFAULT",
  }
} as const;

export type TooltipType = keyof typeof tooltipData;