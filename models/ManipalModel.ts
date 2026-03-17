export const ManipalModel = {
  /**
   * Predicts the probability of vaginal delivery.
   * Returns a percentage (0-100).
   */
  predictRisk: ({
    maternalBmi,
    cervicalDilationCm,
    gestationalAgeWeeks,
    maternalAgeYears,
    headPerineumDistanceCm,
    angleOfProgressionDegrees,
    isCaput,
    binaryPosition,
    hasProlongedLabor,
  }: {
    maternalBmi: number;
    cervicalDilationCm: number;
    gestationalAgeWeeks: number;
    maternalAgeYears: number;
    headPerineumDistanceCm: number;
    angleOfProgressionDegrees: number;
    isCaput: number;
    binaryPosition: number;
    hasProlongedLabor: number;
  }): number => {
    // 1. Initialize Z-Score with the Model Intercept
    let zScore = 0.576705;

    // 2. Add impact of each feature (Standardized & Weighted)
    // maternal_bmi
    zScore += ((maternalBmi - 22.785833) / 3.839733) * -0.040886;

    // cervical_dilation_cm
    zScore += ((cervicalDilationCm - 5.416667) / 1.069138) * -0.76988;

    // gestational_age_weeks
    zScore += ((gestationalAgeWeeks - 38.66025) / 0.885959) * -0.14814;

    // maternal_age_years
    zScore += ((maternalAgeYears - 28.983333) / 3.49281) * -0.104569;

    // head_perineum_distance_cm
    zScore += ((headPerineumDistanceCm - 3.972667) / 0.93999) * -1.622305;

    // angle_of_progression_degrees
    zScore += ((angleOfProgressionDegrees - 113.041667) / 13.435274) * 1.143241;

    // is_caput
    zScore += ((isCaput - 0.308333) / 0.461805) * -0.144293;

    // binary_position
    zScore += ((binaryPosition - 0.133333) / 0.339935) * -0.955437;

    // has_prolonged_labor
    zScore += ((hasProlongedLabor - 0.341667) / 0.474268) * -0.523206;

    // 3. Sigmoid Function (Log-Odds -> Probability)
    // Returns probability of vaginal delivery
    const probability = 1 / (1 + Math.exp(-zScore));

    // Convert to percentage
    return probability * 100;
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
