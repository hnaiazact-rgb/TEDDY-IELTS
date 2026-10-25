/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateOverallBand,
  countWords,
  countParagraphs,
  analyzeWritingMetrics,
  getBandLabel,
} from './ieltsCalculator';

test('calculateOverallBand applies official IELTS quarter rounding rules', () => {
  // Case 1: Exact whole number
  assert.equal(calculateOverallBand(7.0, 7.0, 7.0, 7.0), 7.0);

  // Case 2: Average .25 rounds up to .5
  // (6.0 + 6.0 + 6.5 + 6.5) / 4 = 25 / 4 = 6.25 -> 6.5
  assert.equal(calculateOverallBand(6.0, 6.0, 6.5, 6.5), 6.5);

  // Case 3: Average .75 rounds up to next whole band
  // (6.5 + 7.0 + 6.5 + 7.0) / 4 = 27 / 4 = 6.75 -> 7.0
  assert.equal(calculateOverallBand(6.5, 7.0, 6.5, 7.0), 7.0);

  // Case 4: Average .125 rounds down to .0
  // (6.0 + 6.0 + 6.0 + 6.5) / 4 = 24.5 / 4 = 6.125 -> 6.0
  assert.equal(calculateOverallBand(6.0, 6.0, 6.0, 6.5), 6.0);

  // Case 5: Average .375 rounds up to .5
  // (6.0 + 6.5 + 6.5 + 6.5) / 4 = 25.5 / 4 = 6.375 -> 6.5
  assert.equal(calculateOverallBand(6.0, 6.5, 6.5, 6.5), 6.5);

  // Case 6: Average .625 rounds up to .5 (since frac >= 0.25 and < 0.75)
  // (6.5 + 6.5 + 6.5 + 7.0) / 4 = 26.5 / 4 = 6.625 -> 6.5
  assert.equal(calculateOverallBand(6.5, 6.5, 6.5, 7.0), 6.5);

  // Case 7: Average .875 rounds up to next whole
  // (6.5 + 7.0 + 7.0 + 7.0) / 4 = 27.5 / 4 = 6.875 -> 7.0
  assert.equal(calculateOverallBand(6.5, 7.0, 7.0, 7.0), 7.0);

  // High band 8.5
  assert.equal(calculateOverallBand(8.5, 8.5, 8.5, 8.5), 8.5);
});

test('countWords accurately handles hyphens, percentages, and punctuation', () => {
  assert.equal(countWords(''), 0);
  assert.equal(countWords('   '), 0);
  assert.equal(countWords('This is a test.'), 4);
  assert.equal(countWords('Well-being and state-of-the-art facilities.'), 4);
  assert.equal(countWords('In 2023, approximately 45% of students graduated.'), 7);
  assert.equal(countWords("Don't hesitate; however, academic essays avoid contractions."), 7);
});

test('countParagraphs accurately separates empty lines', () => {
  assert.equal(countParagraphs(''), 0);
  assert.equal(countParagraphs('Paragraph one.'), 1);
  assert.equal(
    countParagraphs('Paragraph one.\n\nParagraph two.\n\n\nParagraph three.'),
    3
  );
});

test('analyzeWritingMetrics checks minimum word count and penalties', () => {
  const shortText = 'This is a very short text about education.';
  const metricsTask2 = analyzeWritingMetrics(shortText, 'task2');
  assert.equal(metricsTask2.meetsMinWordCount, false);
  assert.equal(metricsTask2.minRequired, 250);
  assert.ok(metricsTask2.penaltyWarning !== null);

  // Task 1 threshold is 150
  const metricsTask1 = analyzeWritingMetrics(shortText, 'task1');
  assert.equal(metricsTask1.minRequired, 150);
});

test('getBandLabel gives accurate proficiency descriptions', () => {
  assert.ok(getBandLabel(8.5).includes('Expert User'));
  assert.ok(getBandLabel(7.0).includes('Good User'));
  assert.ok(getBandLabel(6.5).includes('Competent User'));
});
