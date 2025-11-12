/**
 * Quiz validation utilities for simplified question-answer format
 */

export const validateQuestion = (question) => {
  const errors = {};

  if (!question.question || !question.question.trim()) {
    errors.question = 'Question text is required';
  }

  if (!question.answer || !question.answer.trim()) {
    errors.answer = 'Answer is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateAllQuestions = (questions) => {
  if (!questions || questions.length === 0) {
    return {
      isValid: false,
      errors: ['At least one question is required']
    };
  }

  const allErrors = [];
  let isValid = true;

  questions.forEach((question, index) => {
    const { isValid: questionValid, errors } = validateQuestion(question);
    if (!questionValid) {
      isValid = false;
      allErrors[index] = errors;
    }
  });

  return { isValid, errors: allErrors };
};

export const sanitizeQuestion = (question) => {
  return {
    question: question.question?.trim() || '',
    answer: question.answer?.trim() || ''
  };
};

export const sanitizeQuizData = (questions) => {
  return questions.map(sanitizeQuestion);
};
