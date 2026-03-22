import type { IntelligenceReport, Sentiment } from "../types";

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const clamp100 = (value: number) => Math.max(0, Math.min(100, value));

const normalizePercent = (value: number) => clamp01(value / 100);

const sentimentIntegrity = (sentiment: Sentiment) => {
  if (sentiment === "neutral") return 1;
  return 0.8;
};

interface ScoreV2Input {
  credibilityScore: number;
  botLikelihood: number;
  sentiment: Sentiment;
}

interface V2Config {
  credibilityWeight: number;
  botWeight: number;
  sentimentWeight: number;
  disagreementPenaltyWeight: number;
  variancePenaltyWeight: number;
}

const DEFAULT_CONFIG: V2Config = {
  credibilityWeight: 0.55,
  botWeight: 0.30,
  sentimentWeight: 0.15,
  disagreementPenaltyWeight: 0.18,
  variancePenaltyWeight: 0.12,
};

export const calculateTruthScoreV2 = (
  input: ScoreV2Input,
  config: V2Config = DEFAULT_CONFIG,
): number => {
  const credibility = normalizePercent(input.credibilityScore);
  const botSafety = normalizePercent(100 - input.botLikelihood);
  const sentiment = sentimentIntegrity(input.sentiment);

  const signals = [credibility, botSafety, sentiment];

  const baseTruth =
    config.credibilityWeight * credibility +
    config.botWeight * botSafety +
    config.sentimentWeight * sentiment;

  const mean = signals.reduce((acc, signal) => acc + signal, 0) / signals.length;
  const variance =
    signals.reduce((acc, signal) => acc + (signal - mean) ** 2, 0) / signals.length;

  const disagreementPenalty = config.disagreementPenaltyWeight * Math.abs(credibility - botSafety);
  const uncertaintyPenalty = config.variancePenaltyWeight * variance;

  return Math.round(clamp100(100 * (baseTruth - disagreementPenalty - uncertaintyPenalty)));
};

export const calculateConfidenceScoreV2 = (input: ScoreV2Input): number => {
  const credibility = normalizePercent(input.credibilityScore);
  const botSafety = normalizePercent(100 - input.botLikelihood);
  const sentiment = sentimentIntegrity(input.sentiment);
  const signals = [credibility, botSafety, sentiment];

  const mean = signals.reduce((acc, signal) => acc + signal, 0) / signals.length;
  const variance =
    signals.reduce((acc, signal) => acc + (signal - mean) ** 2, 0) / signals.length;

  const normalizedVariance = clamp01(variance / 0.25);
  const evidenceCoverage = 1;

  return Math.round(clamp100(100 * (1 - normalizedVariance) * evidenceCoverage));
};

export const buildExplainabilityV2 = (input: ScoreV2Input) => {
  const topPositiveFactors: string[] = [];
  const topNegativeFactors: string[] = [];
  const confidenceDrivers: string[] = [];

  if (input.credibilityScore >= 70) {
    topPositiveFactors.push("High source credibility signal");
  } else if (input.credibilityScore <= 40) {
    topNegativeFactors.push("Low source credibility signal");
  }

  if (input.botLikelihood <= 30) {
    topPositiveFactors.push("Low coordinated-bot likelihood");
  } else if (input.botLikelihood >= 60) {
    topNegativeFactors.push("Elevated coordinated-bot likelihood");
  }

  if (input.sentiment === "neutral") {
    confidenceDrivers.push("Neutral language profile");
  } else {
    confidenceDrivers.push("Non-neutral sentiment profile");
  }

  return {
    topPositiveFactors,
    topNegativeFactors,
    confidenceDrivers,
    modelDisagreement: 0,
    dataFreshness: 1,
  };
};

export const enrichWithV2Scores = <T extends IntelligenceReport>(report: T): T => {
  const input: ScoreV2Input = {
    credibilityScore: report.credibilityScore,
    botLikelihood: report.botLikelihood,
    sentiment: report.sentiment,
  };

  return {
    ...report,
    truthScore: calculateTruthScoreV2(input),
    riskScore: Math.round(clamp100(report.botLikelihood)),
    confidenceScore: calculateConfidenceScoreV2(input),
    explainability: buildExplainabilityV2(input),
  };
};

export const applyModelDisagreement = (
  primary: IntelligenceReport,
  secondary: IntelligenceReport,
): IntelligenceReport => {
  const primaryTruth = primary.truthScore ?? primary.truthIndex;
  const secondaryTruth = secondary.truthScore ?? secondary.truthIndex;
  const delta = Math.abs(primaryTruth - secondaryTruth);

  const confidencePenalty = Math.round(delta * 0.45);
  const riskPenalty = Math.round(delta * 0.35);

  return {
    ...primary,
    confidenceScore: Math.max(0, (primary.confidenceScore ?? 70) - confidencePenalty),
    riskScore: Math.min(100, (primary.riskScore ?? primary.botLikelihood) + riskPenalty),
    explainability: {
      ...(primary.explainability ?? {
        topPositiveFactors: [],
        topNegativeFactors: [],
        confidenceDrivers: [],
        modelDisagreement: 0,
        dataFreshness: 1,
      }),
      modelDisagreement: Math.round(delta),
    },
  };
};
