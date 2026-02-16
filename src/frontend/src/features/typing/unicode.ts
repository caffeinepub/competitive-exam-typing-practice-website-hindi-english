/**
 * Unicode-safe text segmentation utilities for proper character comparison
 * in both English and Hindi (Devanagari) text.
 */

/**
 * Segment text into grapheme clusters (user-perceived characters)
 * using Intl.Segmenter when available, with fallback to Array.from
 */
export function segmentText(text: string): string[] {
  if (!text) return [];
  
  // Use Intl.Segmenter for proper grapheme segmentation if available
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), segment => segment.segment);
  }
  
  // Fallback: Array.from handles most Unicode correctly
  return Array.from(text);
}

/**
 * Compare two arrays of text segments and return correctness status for each position
 */
export function compareSegments(
  passageSegments: string[],
  typedSegments: string[]
): ('correct' | 'incorrect' | 'untyped')[] {
  const result: ('correct' | 'incorrect' | 'untyped')[] = [];
  
  for (let i = 0; i < passageSegments.length; i++) {
    if (i >= typedSegments.length) {
      result.push('untyped');
    } else if (passageSegments[i] === typedSegments[i]) {
      result.push('correct');
    } else {
      result.push('incorrect');
    }
  }
  
  return result;
}
