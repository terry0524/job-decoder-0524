export interface JdMatchResult {
  score: number;
  matchingSkills: string[];
  missingKeywords: string[];
}

export function calculateJdMatch(
  resumeText: string,
  requiredSkills: string[],
  preferredSkills: string[],
  atsKeywords: string[],
  tools: string[]
): JdMatchResult {
  const lowerResume = resumeText.toLowerCase();

  // Combine all important keywords from the JD
  const allKeywords = [
    ...requiredSkills,
    ...preferredSkills,
    ...atsKeywords,
    ...tools,
  ];
  // Deduplicate
  const unique = [...new Set(allKeywords)];

  const matching: string[] = [];
  const missing: string[] = [];

  for (const keyword of unique) {
    // Check if the resume contains this keyword (case-insensitive, also check base English term)
    const lower = keyword.toLowerCase();
    // Extract core English terms from mixed labels like "Python 프로그래밍"
    const englishPart = keyword.match(/[A-Za-z][A-Za-z0-9/.\-+#]*/)?.[0]?.toLowerCase();

    const found =
      lowerResume.includes(lower) ||
      (englishPart && englishPart.length > 1 && lowerResume.includes(englishPart));

    if (found) {
      matching.push(keyword);
    } else {
      missing.push(keyword);
    }
  }

  // Weighted score: required skills count more
  const requiredSet = new Set(requiredSkills.map(s => s.toLowerCase()));
  let totalWeight = 0;
  let matchedWeight = 0;

  for (const kw of unique) {
    const isRequired = requiredSet.has(kw.toLowerCase());
    const weight = isRequired ? 3 : 1;
    totalWeight += weight;
    if (matching.map(m => m.toLowerCase()).includes(kw.toLowerCase())) {
      matchedWeight += weight;
    }
  }

  const score = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0;

  return { score, matchingSkills: matching, missingKeywords: missing };
}
