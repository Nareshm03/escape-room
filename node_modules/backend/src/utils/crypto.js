// Caesar cipher decoder
const caesarDecode = (text, shift) => {
  return text.replace(/[A-Za-z]/g, char => {
    const start = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - start - shift + 26) % 26) + start);
  });
};

// Base64 decoder
const base64Decode = (text) => {
  try {
    return Buffer.from(text, 'base64').toString('utf8');
  } catch (error) {
    return null;
  }
};

// Substitution cipher decoder (A=1, B=2, etc.)
const substitutionDecode = (text) => {
  return text.split('-').map(num => {
    const n = parseInt(num);
    return n >= 1 && n <= 26 ? String.fromCharCode(64 + n) : '';
  }).join('').toLowerCase();
};

// ROT13 decoder
const rot13Decode = (text) => {
  return text.replace(/[A-Za-z]/g, char => {
    const start = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
  });
};

// Validate cryptography answer
const validateCryptoAnswer = (puzzle, userAnswer) => {
  const answer = userAnswer.toLowerCase().trim();
  const expected = puzzle.correct_answer.toLowerCase().trim();
  
  // Direct match
  if (answer === expected) return true;
  
  // Try different decoding methods based on puzzle content
  const puzzleText = puzzle.puzzle_text.toLowerCase();
  
  // Caesar cipher variations
  if (puzzleText.includes('caesar')) {
    for (let shift = 1; shift <= 25; shift++) {
      const decoded = caesarDecode(userAnswer, shift).toLowerCase().trim();
      if (decoded === expected) return true;
    }
  }
  
  // Base64 decoding
  if (puzzleText.includes('base64')) {
    const decoded = base64Decode(userAnswer);
    if (decoded && decoded.toLowerCase().trim() === expected) return true;
  }
  
  // Substitution cipher
  if (puzzleText.includes('substitution') || puzzleText.includes('a=1')) {
    const decoded = substitutionDecode(userAnswer);
    if (decoded === expected) return true;
  }
  
  // ROT13
  if (puzzleText.includes('rot13')) {
    const decoded = rot13Decode(userAnswer).toLowerCase().trim();
    if (decoded === expected) return true;
  }
  
  // Mixed crypto (Base64 then Caesar)
  if (puzzleText.includes('mixed') || puzzleText.includes('two-step')) {
    const base64Decoded = base64Decode(userAnswer);
    if (base64Decoded) {
      for (let shift = 1; shift <= 25; shift++) {
        const finalDecoded = caesarDecode(base64Decoded, shift).toLowerCase().trim();
        if (finalDecoded === expected) return true;
      }
    }
  }
  
  return false;
};

module.exports = {
  caesarDecode,
  base64Decode,
  substitutionDecode,
  rot13Decode,
  validateCryptoAnswer
};