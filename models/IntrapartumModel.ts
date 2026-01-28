// models/IntrapartumeModel.ts

export const IntrapartumModel = {
  predictRisk: ({
    gestationWeeks,
    cervicalDilationCm,
    caputSuccedaneumMm,
    headPerineumDistanceMm,
    occiputPosition,
    maternalAgeYears,
    maternalBmi,
    prolongedLabor,
  }: {
    gestationWeeks: number;
    cervicalDilationCm: number;
    caputSuccedaneumMm: number;
    headPerineumDistanceMm: number;
    occiputPosition: string;
    maternalAgeYears: number;
    maternalBmi: number;
    prolongedLabor: boolean;
  }): number => {
    // Logic port
    const occiputPosterior =
      occiputPosition === "LOP" || occiputPosition === "ROP" ? 1 : 0;

    const prolongedLaborBinary = prolongedLabor ? 1 : 0;
    const caputBinary = caputSuccedaneumMm >= 10 ? 1 : 0;
    const headPerineumBinary = headPerineumDistanceMm > 40 ? 1 : 0;

    const logRiskScore =
      18.52 +
      1.58 * headPerineumBinary +
      1.62 * caputBinary -
      0.57 * occiputPosterior +
      0.07 * maternalAgeYears -
      0.05 * maternalBmi -
      0.51 * gestationWeeks -
      1.31 * prolongedLaborBinary +
      0.27 * cervicalDilationCm;

    const probabilityVaginalDelivery = 1 / (1 + Math.exp(-logRiskScore));

    return probabilityVaginalDelivery * 100; // Return as percentage immediately
  },

  getRiskLabel: (percentage: number): string => {
    const probability = percentage / 100;
    if (probability >= 0.9) return "Highly Likely";
    if (probability >= 0.75) return "Likely";
    if (probability >= 0.5) return "Neutral";
    if (probability >= 0.25) return "Unlikely";
    return "Highly Unlikely";
  },
};
