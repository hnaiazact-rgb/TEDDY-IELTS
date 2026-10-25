/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Calculates official IELTS Writing band score from 4 criteria:
 * - Task Achievement / Task Response (TA/TR)
 * - Coherence & Cohesion (CC)
 * - Lexical Resource (LR)
 * - Grammatical Range & Accuracy (GRA)
 *
 * Official IELTS rounding rule:
 * Average of the 4 scores:
 * - If average ends in .25 -> rounded up to the nearest half band (e.g., 6.25 -> 6.5)
 * - If average ends in .75 -> rounded up to the nearest whole band (e.g., 6.75 -> 7.0)
 * - If average ends in .125 -> rounded down to .0 (e.g., 6.125 -> 6.0)
 * - If average ends in .375 -> rounded up to .5 (e.g., 6.375 -> 6.5)
 * - If average ends in .625 -> rounded up to .5 (e.g., 6.625 -> 6.5)
 * - If average ends in .875 -> rounded up to whole band (e.g., 6.875 -> 7.0)
 */
export function calculateOverallBand(
  ta: number,
  cc: number,
  lr: number,
  gra: number
): number {
  const avg = (ta + cc + lr + gra) / 4;
  const intPart = Math.floor(avg);
  const frac = avg - intPart;

  if (frac < 0.25) {
    return intPart;
  } else if (frac < 0.75) {
    return intPart + 0.5;
  } else {
    return intPart + 1.0;
  }
}

/**
 * Accurately counts words in an essay according to IELTS word-count rules:
 * - Hyphenated words (e.g., well-being, high-tech) count as 1 word.
 * - Numbers and percentages (e.g., 25%, 1990s) count as words.
 * - Contractions (e.g., don't, can't) count as 1 word (though informal in academic writing).
 */
export function countWords(text: string): number {
  if (!text || !text.trim()) return 0;
  // Match contiguous non-whitespace sequences, stripping stray punctuation
  const matches = text.trim().match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*%?/g);
  return matches ? matches.length : 0;
}

/**
 * Counts non-empty paragraphs
 */
export function countParagraphs(text: string): number {
  if (!text || !text.trim()) return 0;
  return text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0).length;
}

export interface MetricAnalysis {
  wordCount: number;
  paragraphCount: number;
  sentenceCount: number;
  avgSentenceLength: number;
  meetsMinWordCount: boolean;
  minRequired: number;
  wordCountDeficit: number;
  penaltyWarning: string | null;
  lexicalDiversityRatio: number; // unique words / total words
}

export function analyzeWritingMetrics(
  text: string,
  taskType: 'task1' | 'task2'
): MetricAnalysis {
  const minRequired = taskType === 'task1' ? 150 : 250;
  const wordCount = countWords(text);
  const paragraphCount = countParagraphs(text);

  // Split by sentence terminators (. ! ?)
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const sentenceCount = sentences.length || (wordCount > 0 ? 1 : 0);
  const avgSentenceLength =
    sentenceCount > 0 ? Math.round((wordCount / sentenceCount) * 10) / 10 : 0;

  const meetsMinWordCount = wordCount >= minRequired;
  const wordCountDeficit = meetsMinWordCount ? 0 : minRequired - wordCount;

  let penaltyWarning: string | null = null;
  if (!meetsMinWordCount && wordCount > 0) {
    penaltyWarning = `Bài viết chưa đạt độ dài tối thiểu (${wordCount}/${minRequired} từ). Bạn có thể bị trừ 0.5 - 1.0 điểm ở tiêu chí Task Achievement/Response.`;
  }

  // Lexical diversity (Type-Token Ratio on lowercased alphanumeric words)
  const tokens = (text.toLowerCase().match(/[a-z]+/g) || []);
  const uniqueTokens = new Set(tokens);
  const lexicalDiversityRatio =
    tokens.length > 0 ? Math.round((uniqueTokens.size / tokens.length) * 100) / 100 : 0;

  return {
    wordCount,
    paragraphCount,
    sentenceCount,
    avgSentenceLength,
    meetsMinWordCount,
    minRequired,
    wordCountDeficit,
    penaltyWarning,
    lexicalDiversityRatio,
  };
}

/**
 * Evaluates band level descriptor description
 */
export function getBandLabel(band: number): string {
  if (band >= 8.5) return 'Expert User (Cực kỳ xuất sắc)';
  if (band >= 8.0) return 'Very Good User (Rất tốt, tiệm cận bản xứ)';
  if (band >= 7.0) return 'Good User (Tốt, đáp ứng đại học top đầu)';
  if (band >= 6.0) return 'Competent User (Khá, đủ điều kiện du học)';
  if (band >= 5.0) return 'Modest User (Trung bình, cần cải thiện)';
  return 'Developing User (Cần bổ sung kiến thức cơ bản)';
}
