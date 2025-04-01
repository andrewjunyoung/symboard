export function isCombiningCharacter(text) {
  const ranges = [
    [0x0300, 0x036f], // Combining Diacritical Marks
    [0x1ab0, 0x1aff], // Combining Diacritical Marks Extended
    [0x1dc0, 0x1dff], // Combining Diacritical Marks Supplement
    [0x20d0, 0x20ff], // Combining Diacritical Marks for Symbols
  ];

  if (!text || text.length === 0) return false;
  const codePoint = text.codePointAt(0);
  if (!codePoint) return false;

  for (const [start, end] of ranges) {
    if (codePoint >= start && codePoint <= end) {
      return true;
    }
  }

  return false;
}

