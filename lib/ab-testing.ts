// A/B Testing Framework for vSMPL Ecosystem
// Handles variant assignment, persistence, and rendering logic

export type Variant = 'control' | 'variant_a' | 'variant_b';

export interface ABTest {
  test_name: string;
  page: string;
  variant_type: string;
  control: string;
  variant_a: string | null;
  variant_b: string | null;
  split_percentage: number;
  active: boolean;
}

// Client-side A/B test assignment
export function assignVariant(testName: string, sessionId: string): Variant {
  // Check if variant already assigned
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(`ab_test_${testName}`);
    if (stored && ['control', 'variant_a', 'variant_b'].includes(stored)) {
      return stored as Variant;
    }
  }

  // Use session ID to deterministically assign variant (consistent for same session)
  const hash = hashString(sessionId + testName);
  const random = (hash % 100) / 100; // 0.00 to 0.99

  // 50/50 split between control and variant_a by default
  const variant: Variant = random < 0.5 ? 'control' : 'variant_a';

  // Store assignment
  if (typeof window !== 'undefined') {
    localStorage.setItem(`ab_test_${testName}`, variant);
    document.cookie = `ab_test_${testName}=${variant}; path=/; max-age=2592000`; // 30 days
  }

  return variant;
}

// Simple string hash function for deterministic assignment
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Get assigned variant from storage
export function getAssignedVariant(testName: string): Variant | null {
  if (typeof window === 'undefined') return null;

  // Check localStorage
  const stored = localStorage.getItem(`ab_test_${testName}`);
  if (stored && ['control', 'variant_a', 'variant_b'].includes(stored)) {
    return stored as Variant;
  }

  // Check cookie
  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith(`ab_test_${testName}=`));

  if (cookie) {
    const value = cookie.split('=')[1];
    if (['control', 'variant_a', 'variant_b'].includes(value)) {
      localStorage.setItem(`ab_test_${testName}`, value);
      return value as Variant;
    }
  }

  return null;
}

// React hook for A/B testing
export function useABTest(testName: string, sessionId: string): Variant {
  if (typeof window === 'undefined') return 'control';

  const existing = getAssignedVariant(testName);
  if (existing) return existing;

  return assignVariant(testName, sessionId);
}

// Get content based on variant
export function getVariantContent(test: ABTest, variant: Variant): string {
  switch (variant) {
    case 'variant_a':
      return test.variant_a || test.control;
    case 'variant_b':
      return test.variant_b || test.control;
    default:
      return test.control;
  }
}

// Calculate statistical significance (chi-square test)
export function calculateSignificance(
  controlConversions: number,
  controlTotal: number,
  variantConversions: number,
  variantTotal: number
): { significant: boolean; pValue: number; uplift: number } {
  const controlRate = controlTotal > 0 ? controlConversions / controlTotal : 0;
  const variantRate = variantTotal > 0 ? variantConversions / variantTotal : 0;

  const uplift = controlRate > 0 ? ((variantRate - controlRate) / controlRate) * 100 : 0;

  // Chi-square calculation
  const pooledRate = (controlConversions + variantConversions) / (controlTotal + variantTotal);

  const expectedControlConversions = controlTotal * pooledRate;
  const expectedVariantConversions = variantTotal * pooledRate;

  const expectedControlNonConversions = controlTotal * (1 - pooledRate);
  const expectedVariantNonConversions = variantTotal * (1 - pooledRate);

  const chiSquare =
    Math.pow(controlConversions - expectedControlConversions, 2) / expectedControlConversions +
    Math.pow(variantConversions - expectedVariantConversions, 2) / expectedVariantConversions +
    Math.pow(
      controlTotal - controlConversions - expectedControlNonConversions,
      2
    ) / expectedControlNonConversions +
    Math.pow(
      variantTotal - variantConversions - expectedVariantNonConversions,
      2
    ) / expectedVariantNonConversions;

  // Critical value for 95% confidence with 1 degree of freedom is 3.841
  const significant = chiSquare > 3.841 && controlTotal >= 100 && variantTotal >= 100;

  // Approximate p-value (simplified)
  const pValue = chiSquare > 3.841 ? 0.05 : 0.5;

  return { significant, pValue, uplift };
}

// Pre-configured A/B tests for each page
export const AB_TESTS = {
  hub: {
    hero_copy: 'hub_hero_copy',
    cta_color: 'hub_cta_color',
    brand_layout: 'hub_brand_layout',
  },
  uniformish: {
    hero_image: 'uniformish_hero_image',
    email_placement: 'uniformish_email_placement',
    scarcity_messaging: 'uniformish_scarcity_messaging',
  },
  catnip: {
    hero_video: 'catnip_hero_video',
    deck_layout: 'catnip_deck_layout',
    community_prominence: 'catnip_community_prominence',
  },
  badArctic: {
    pricing: 'badArctic_pricing',
    craftsmanship_depth: 'badArctic_craftsmanship_depth',
    cta: 'badArctic_cta',
  },
};
