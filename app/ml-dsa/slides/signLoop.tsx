import React, { useState } from 'react';
import './Diagram.css';

const RejectionSamplingDiagram = () => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const steps = [
    {
      id: 1,
      title: "Initialize",
      description: "Set (z, h) = ⊥ to start the rejection sampling loop",
      details: "This indicates no valid signature has been produced yet. The loop continues until a valid (z, h) pair is found.",
      equation: null,
      securityNote: "Rejection sampling ensures the signature doesn't leak information about the secret key."
    },
    {
      id: 2,
      title: "Sample y",
      description: "Sample random polynomial y ← R_q",
      details: "y is sampled uniformly from the polynomial ring R_q. This randomness is crucial for security.",
      equation: "y ∈ R_q",
      securityNote: "Fresh randomness each iteration prevents pattern analysis."
    },
    {
      id: 3,
      title: "Expand Mask",
      description: "ℓ ← ExpandMask(ρ″, κ)",
      details: "Expands a pseudorandom seed ρ″ with counter κ to generate masking values.",
      equation: "ℓ = ExpandMask(ρ″, κ)",
      securityNote: "Deterministic expansion allows reproducibility."
    },
    {
      id: 4,
      title: "Compute w",
      description: "w ← NTT⁻¹(A ∘ NTT(y))",
      details: "Transform to NTT domain, multiply by matrix A, then transform back.",
      equation: "w = A·y (in polynomial ring)",
      securityNote: "NTT enables fast polynomial multiplication (O(n log n) instead of O(n²))."
    },
    {
      id: 5,
      title: "Extract High Bits",
      description: "w₁ ← HighBits(w)",
      details: "Extract high-order bits from each component of w for compression.",
      equation: "w = w₁·2ᵈ + w₀",
      securityNote: "HighBits form the commitment sent to the verifier."
    },
    {
      id: 6,
      title: "Commitment Hash",
      description: "c̃ ← H(μ ‖ w₁Encode(w₁), λ/4)",
      details: "Hash the message μ and encoded commitment w₁.",
      equation: "c̃ = H(μ || encode(w₁))",
      securityNote: "Cryptographic hash ensures binding property."
    },
    {
      id: 7,
      title: "Sample Challenge",
      description: "c ← SampleInBall(c̃)",
      details: "Convert hash output to a challenge polynomial with τ ones.",
      equation: "c ∈ B_τ (Hamming weight τ)",
      securityNote: "Challenge space size ~ C(n,τ) prevents brute force."
    },
    {
      id: 8,
      title: "NTT Transform",
      description: "ĉ ← NTT(c)",
      details: "Convert challenge to NTT domain for efficient multiplication.",
      equation: "ĉ = NTT(c)",
      securityNote: "NTT domain multiplication is component-wise."
    },
    {
      id: 9,
      title: "Multiply with Secret",
      description: "⟨⟨c·s₁⟩⟩, ⟨⟨c·s₂⟩⟩",
      details: "Multiply challenge with secret key components in NTT domain.",
      equation: "c·s₁, c·s₂ (polynomial multiplication)",
      securityNote: "Secret keys s₁, s₂ are never exposed directly."
    },
    {
      id: 10,
      title: "Compute Response",
      description: "z ← y + ⟨⟨c·s₁⟩⟩",
      details: "Add masked randomness to challenge-weighted secret.",
      equation: "z = y + c·s₁",
      securityNote: "This is the main signature component."
    },
    {
      id: 11,
      title: "Low Bits",
      description: "r₀ ← LowBits(w - ⟨⟨c·s₂⟩⟩)",
      details: "Extract low-order bits for reconstruction.",
      equation: "r₀ = LowBits(w - c·s₂)",
      securityNote: "Helps verifier check without revealing secret."
    },
    {
      id: 12,
      title: "Check Norms",
      description: "Check ‖z‖∞ and ‖r₀‖∞",
      details: "Verify infinity norms are below thresholds.",
      equation: "‖z‖∞ < γ₁-β AND ‖r₀‖∞ < γ₂-β",
      securityNote: "Ensures no secret information leaks."
    },
    {
      id: 13,
      title: "Generate Hint",
      description: "h ← MakeHint(-⟨⟨c·t₀⟩⟩, ...)",
      details: "Create hint to help verifier reconstruct high bits.",
      equation: "h = hint bits (0 or 1 per component)",
      securityNote: "Limited to ω ones to control size."
    },
    {
      id: 14,
      title: "Final Checks",
      description: "Check hint bounds and weight",
      details: "Verify hint doesn't exceed γ₂ and has ≤ ω ones.",
      equation: "‖c·t₀‖∞ < γ₂ AND weight(h) ≤ ω",
      securityNote: "Prevents signature bloat and maintains correctness."
    }
  ];

  // Group steps for better visualization
  const phases = [
    { name: "Initialization", steps: [0] },
    { name: "Sampling & NTT", steps: [1, 2, 3, 4] },
    { name: "Commitment", steps: [5, 6, 7] },
    { name: "Response Generation", steps: [8, 9, 10] },
    { name: "Verification Prep", steps: [11, 12] },
    { name: "Finalization", steps: [13] }
  ];

  return (
    <div className="diagram-container">
      <h1>Dilithium-Style Rejection Sampling Loop</h1>
      <p className="subtitle">Hover over any step to see detailed explanation</p>
      
      <div className="flowchart">
        {/* Loop start */}
        <div className="loop-start">
          <div className="step-node start-node">
            Start
          </div>
          <div className="arrow">↓</div>
        </div>

        {/* Rejection sampling loop container */}
        <div className="rejection-loop">
          <div className="loop-label">Rejection Sampling Loop</div>
          
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div 
                className="step-wrapper"
                onMouseEnter={() => setHoveredStep(idx)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div className={`step-node phase-${idx % 3}`}>
                  <div className="step-number">{step.id}</div>
                  <div className="step-title">{step.title}</div>
                </div>
                
                {/* Info card that appears on hover */}
                {hoveredStep === idx && (
                  <div className="info-card">
                    <h3>{step.title}</h3>
                    <p className="step-desc">{step.description}</p>
                    <div className="info-section">
                      <strong>📖 Details:</strong>
                      <p>{step.details}</p>
                    </div>
                    {step.equation && (
                      <div className="info-section equation">
                        <strong>📐 Operation:</strong>
                        <code>{step.equation}</code>
                      </div>
                    )}
                    <div className="info-section security">
                      <strong>🔒 Security:</strong>
                      <p>{step.securityNote}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Arrow except after last step */}
              {idx < steps.length - 1 && (
                <div className="arrow">
                  {idx === 11 ? "No →" : idx === 12 ? "Yes →" : "↓"}
                  {idx === 11 && <span className="branch-label">valid</span>}
                  {idx === 12 && <span className="branch-label">invalid</span>}
                </div>
              )}
            </React.Fragment>
          ))}
          
          {/* Loop back arrow */}
          <div className="loop-back">
            <div className="arrow loop-arrow">↺ κ ← κ + ℓ</div>
          </div>
        </div>
        
        {/* End node */}
        <div className="step-node end-node">
          Return (z, h)
        </div>
      </div>
      
      {/* Parameter legend */}
      <div className="legend">
        <h3>Parameters</h3>
        <div className="params-grid">
          <div><strong>γ₁, γ₂</strong> – Norm bounds for rejection</div>
          <div><strong>β</strong> – Security margin</div>
          <div><strong>ω</strong> – Max hint weight</div>
          <div><strong>κ</strong> – Counter (incremented by ℓ each loop)</div>
          <div><strong>λ</strong> – Security parameter (bits)</div>
        </div>
      </div>
    </div>
  );
};

export default RejectionSamplingDiagram;