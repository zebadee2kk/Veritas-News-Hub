# Intelligence Algorithm V2 Plan

This document defines a more sophisticated scoring algorithm for Veritas intelligence analysis.

## Goal

Replace the current single weighted formula with a multi-signal, calibrated, confidence-aware scoring pipeline that is more robust to noisy model output and source bias.

## Current Limitation Summary

Current `calculateTruthIndex` uses:

- credibility score
- inverse bot risk
- sentiment preference for neutral

Limitations:

- No confidence estimate
- No source reliability history
- No temporal volatility control
- No disagreement handling between Gemini and Grok

## Proposed V2 Architecture

## 1. Signal Layers

1. Content Integrity Signals
- LLM credibility estimate
- Claim density and contradiction risk
- Sensational language score

2. Source Reliability Signals
- Source trust prior (historical)
- Domain-level correction rate
- Recency-adjusted reliability trend

3. Network/Propagation Signals
- Bot-likelihood estimate
- Coordination indicators from social velocity patterns
- Cross-source corroboration count

4. Model Agreement Signals
- Gemini vs Grok score divergence
- Summary semantic consistency
- Reasoning overlap ratio

## 2. Score Outputs

For each article produce:

- `truthScore` (0-100)
- `riskScore` (0-100)
- `confidenceScore` (0-100)
- `explainability` payload (top weighted factors)

## 3. Aggregation Method

Use normalized components with robust clamping:

- Normalize each raw signal to [0,1]
- Weighted sum by signal family
- Apply confidence penalty when family variance is high
- Convert to [0,100] and round

High-level formula:

- `baseTruth = sum(weight_i * signal_i)`
- `disagreementPenalty = alpha * modelDivergence`
- `uncertaintyPenalty = beta * signalVariance`
- `truthScore = clamp(100 * (baseTruth - disagreementPenalty - uncertaintyPenalty))`

Confidence formula:

- `confidenceScore = clamp(100 * (1 - normalizedVariance) * evidenceCoverage)`

## 4. Reliability Priors

Add source memory table (initially JSON or in-memory cache, later DB):

- `sourceName`
- `priorTrust` (0-1)
- `observedErrorRate`
- `lastUpdated`
- `sampleCount`

Bayesian-style update per article:

- `posterior = (prior * n + observed) / (n + 1)`

## 5. Model Disagreement Handling

When Gemini and Grok both available:

- Compute absolute score delta
- If delta > threshold:
  - reduce confidence
  - increase riskScore
  - add explanation flag: `high_model_disagreement`

Fallback behavior:

- If one model unavailable, continue with available model and lower confidence slightly.

## 6. Explainability Contract

Return an explainable object:

- `topPositiveFactors`
- `topNegativeFactors`
- `confidenceDrivers`
- `modelDisagreement`
- `dataFreshness`

This should be shown in the sidebar report to support analyst trust.

## 7. Phased Implementation Plan

Phase A: Algorithm scaffolding
- Add new types for multi-score outputs
- Add normalization and clamping helpers
- Add confidence computation and penalties

Phase B: Source priors
- Add source trust map (file-backed)
- Integrate prior into scoring
- Add update function after each analysis

Phase C: Dual-model reconciliation
- Add divergence and agreement functions
- Integrate confidence/risk adjustments

Phase D: UI integration
- Display `confidenceScore` and disagreement badge
- Show explainability factors

Phase E: Validation
- Regression tests for score stability
- Scenario tests (high bot risk, low trust source, high disagreement)
- Calibration review with historical samples

## 8. Data Structures (Suggested)

```ts
interface IntelligenceScoreV2 {
  truthScore: number;
  riskScore: number;
  confidenceScore: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  explainability: {
    topPositiveFactors: string[];
    topNegativeFactors: string[];
    confidenceDrivers: string[];
    modelDisagreement: number;
    dataFreshness: number;
  };
}
```

## 9. Success Criteria

- Reduced score jitter for similar articles
- Better handling of conflicting model outputs
- Clear confidence metric for analyst decisions
- Explainable factor traces in UI
