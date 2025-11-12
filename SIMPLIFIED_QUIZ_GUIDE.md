# Simplified Quiz Builder - Implementation Guide

## Overview
Streamlined question-answer interface with sequential-unlock functionality.

## Data Structure

### Simplified Format
```json
{
  "title": "Quiz Title",
  "description": "Quiz description",
  "questions": [
    {
      "question": "What is 2+2?",
      "answer": "4"
    },
    {
      "question": "What color is the sky?",
      "answer": "blue"
    }
  ]
}
```

## Components

### SimpleQuestionForm
**Location**: `frontend/src/components/SimpleQuestionForm.js`

**Props**:
- `question`: Object with question and answer
- `onChange`: Callback when question changes
- `onRemove`: Callback to remove question
- `index`: Question number (0-based)

**Features**:
- Question textarea (500 char limit)
- Answer textarea (1000 char limit)
- Real-time validation
- Character counters
- Error indicators

**Usage**:
```jsx
import SimpleQuestionForm from './components/SimpleQuestionForm';

const [questions, setQuestions] = useState([]);

const handleQuestionChange = (index, updatedQuestion) => {
  const newQuestions = [...questions];
  newQuestions[index] = updatedQuestion;
  setQuestions(newQuestions);
};

<SimpleQuestionForm
  question={questions[0]}
  onChange={(q) => handleQuestionChange(0, q)}
  onRemove={() => removeQuestion(0)}
  index={0}
/>
```

## Validation

### Question Validation
```javascript
import { validateQuestion } from './utils/quizValidation';

const { isValid, errors } = validateQuestion({
  question: 'What is 2+2?',
  answer: '4'
});

// isValid: true/false
// errors: { question?: string, answer?: string }
```

### All Questions Validation
```javascript
import { validateAllQuestions } from './utils/quizValidation';

const { isValid, errors } = validateAllQuestions(questions);

if (!isValid) {
  console.log('Validation errors:', errors);
}
```

### Data Sanitization
```javascript
import { sanitizeQuizData } from './utils/quizValidation';

const cleanQuestions = sanitizeQuizData(questions);
// Trims whitespace from all questions and answers
```

## UI Components

### Question Input
- Type: Textarea
- Max length: 500 characters
- Required: Yes
- Placeholder: "Enter your question"
- Rows: 3

### Answer Input
- Type: Textarea
- Max length: 1000 characters
- Required: Yes
- Placeholder: "Enter the correct answer"
- Rows: 4

### Validation Indicators
- Empty field: Red border (2px solid #ef4444)
- Error message: Red text below field
- Character counter: Gray text (current/max)

## Validation Rules

### Question Field
- Cannot be empty
- Whitespace trimmed before validation
- Max 500 characters
- Required indicator (*)

### Answer Field
- Cannot be empty
- Whitespace trimmed before validation
- Max 1000 characters
- Required indicator (*)

## Implementation Example

### Quiz Builder Component
```jsx
import React, { useState } from 'react';
import SimpleQuestionForm from './components/SimpleQuestionForm';
import { validateAllQuestions, sanitizeQuizData } from './utils/quizValidation';
import { useToast } from './utils/ToastContext';

const QuizBuilder = () => {
  const [questions, setQuestions] = useState([
    { question: '', answer: '' }
  ]);
  const toast = useToast();

  const addQuestion = () => {
    setQuestions([...questions, { question: '', answer: '' }]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, updatedQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const handleSave = async () => {
    const { isValid, errors } = validateAllQuestions(questions);
    
    if (!isValid) {
      toast.error('Please fill in all required fields');
      return;
    }

    const cleanQuestions = sanitizeQuizData(questions);
    
    try {
      await api.post('/quiz/create', {
        title: 'My Quiz',
        questions: cleanQuestions
      });
      toast.success('Quiz saved successfully!');
    } catch (error) {
      toast.error('Failed to save quiz');
    }
  };

  return (
    <div>
      {questions.map((q, index) => (
        <SimpleQuestionForm
          key={index}
          question={q}
          onChange={(updated) => handleQuestionChange(index, updated)}
          onRemove={() => removeQuestion(index)}
          index={index}
        />
      ))}
      
      <button onClick={addQuestion}>Add Question</button>
      <button onClick={handleSave}>Save Quiz</button>
    </div>
  );
};
```

## Preview Component

### Simple Preview
```jsx
const QuizPreview = ({ questions }) => {
  return (
    <div className="quiz-preview">
      <h2>Quiz Preview</h2>
      {questions.map((q, index) => (
        <div key={index} className="preview-question">
          <h3>Question {index + 1}</h3>
          <p className="question-text">{q.question}</p>
          <div className="answer-section">
            <strong>Answer:</strong>
            <p>{q.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
```

## Backend Integration

### API Endpoint
```javascript
router.post('/create', async (req, res) => {
  const { title, description, questions } = req.body;
  
  // Validate
  if (!questions || questions.length === 0) {
    return res.status(400).json({ error: 'At least one question required' });
  }
  
  // Check each question
  for (const q of questions) {
    if (!q.question?.trim() || !q.answer?.trim()) {
      return res.status(400).json({ 
        error: 'All questions must have both question and answer' 
      });
    }
  }
  
  // Save quiz
  const quiz = await Quiz.create({
    title,
    description,
    questions: questions.map((q, index) => ({
      questionText: q.question.trim(),
      correctAnswer: q.answer.trim(),
      questionOrder: index + 1
    }))
  });
  
  res.status(201).json({ success: true, quiz });
});
```

## Testing Checklist

### Validation Tests
- [x] Empty question rejected
- [x] Empty answer rejected
- [x] Whitespace-only question rejected
- [x] Whitespace-only answer rejected
- [x] Valid question-answer accepted
- [x] Character limits enforced

### UI Tests
- [x] Question input renders
- [x] Answer input renders
- [x] Character counter updates
- [x] Error messages display
- [x] Red border on error
- [x] Remove button works

### Integration Tests
- [x] Questions save correctly
- [x] Preview shows question and answer
- [x] JSON structure correct
- [x] Backend validates data
- [x] Frontend validates before submit

## Success Criteria ✅

- ✅ 100% questions have both fields
- ✅ Preview shows only question and answer
- ✅ Data persisted in simplified structure
- ✅ UI clean and focused
- ✅ No legacy code remains
- ✅ System rejects incomplete submissions

## Removed Features

### Eliminated
- ❌ Question type selection
- ❌ Points field
- ❌ Hints functionality
- ❌ Multiple choice options
- ❌ True/false options
- ❌ Complex question types

### Retained
- ✅ Question text
- ✅ Answer text
- ✅ Save functionality
- ✅ Preview functionality
- ✅ Validation

---

**Status**: ✅ Complete
**Format**: Simplified Question-Answer
**Validation**: Required fields only
**Version**: 1.0.0
