export const ManipalModel = {
  /**
   * Predicts the probability of C-SECTION (Risk).
   * Returns a percentage (0-100).
   */
  predictRisk: ({
    maternalAgeYears,
    headPerineumDistanceCm,
    angleOfProgressionDegrees,
    isCaput,
    binaryPosition,
    hasProlongedLabor,
  }: {
    maternalAgeYears: number;
    headPerineumDistanceCm: number;
    angleOfProgressionDegrees: number;
    isCaput: number; // 0 or 1
    binaryPosition: number; // 0 or 1
    hasProlongedLabor: boolean;
  }): number => {
    // 1. Initialize Z-Score with the Model Intercept
    let zScore = -0.40593;

    // 2. Add impact of each feature (Standardized & Weighted)
    // maternal_age_years
    zScore += ((maternalAgeYears - 28.97479) / 3.50621) * 0.40108;

    // head_perineum_distance_cm
    zScore += ((headPerineumDistanceCm - 4.1916) / 0.88723) * 0.66478;

    // angle_of_progression_degrees
    zScore += ((angleOfProgressionDegrees - 110.84034) / 13.41389) * -0.48739;

    // is_caput
    zScore += ((isCaput - 0.30252) / 0.45935) * 0.45071;

    // binary_position
    zScore += ((binaryPosition - 0.13445) / 0.34114) * 1.06755;

    // has_prolonged_labor
    zScore += (((hasProlongedLabor ? 1 : 0) - 0.33613) / 0.47239) * 0.77227;

    // 3. Sigmoid Function (Log-Odds -> Probability)
    // Returns probability of Class 1 (C-Section)
    const probabilityCSection = 1 / (1 + Math.exp(-zScore));

    // Convert to probability of vaginal delivery (inverse)
    const probabilityVaginalDelivery = (1 - probabilityCSection) * 100;

    return probabilityVaginalDelivery;
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
