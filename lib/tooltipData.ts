export const tooltipData = {
  d: {
    title: "test",
    description: "dddddddddddd",
    details: "Each coefficient is uniformly random in [0, 8380417)",
  },
  z_keygen: {
    title: "Key Generation Matrix A",
    description: "Randomly generated matrix A for ML-DSA",
    details: "Each coefficient is uniformly random in [0, 8380417)",
  },
  rho_keygen: {
    title: "Signing Matrix y",
    description: "Random masking vector for signature generation",
    details: "Values are sampled from a uniform distribution",
  },
  sigma_keygen: {
    title: "Verification Data",
    description: "Values used during signature verification",
    details: "Includes hash values and polynomial coefficients",
  },
  A_keygen: {
    title: "Verification Data",
    description: "Values used during signature verification",
    details: "Includes hash values and polynomial coefficients",
  },
  s_keygen: {
    title: "Verification Data",
    description: "Values used during signature verification",
    details: "Includes hash values and polynomial coefficients",
  },
  e_keygen: {
    title: "Verification Data",
    description: "Values used during signature verification",
    details: "Includes hash values and polynomial coefficients",
  },
  t_keygen: {
    title: "Verification Data",
    description: "Values used during signature verification",
    details: "Includes hash values and polynomial coefficients",
  },
  ekPKE_keygen: {
    title: "Verification Data",
    description: "Values used during signature verification",
    details: "Includes hash values and polynomial coefficients",
  },
  dkPKE_keygen: {
    title: "Verification Data",
    description: "Values used during signature verification",
    details: "Includes hash values and polynomial coefficients",
  },
  default: {
    title: "ML-DSA Matrix",
    description: "Coefficient visualization",
    details: "Each cell shows a polynomial coefficient value",
  }
} as const;

export type TooltipType = keyof typeof tooltipData;