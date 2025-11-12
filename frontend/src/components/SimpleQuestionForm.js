import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './SimpleQuestionForm.css';

const SimpleQuestionForm = ({ question, onChange, onRemove, index }) => {
  const [errors, setErrors] = useState({});
  const [localQuestion, setLocalQuestion] = useState(question || {
    question: '',
    answer: ''
  });

  const validate = () => {
    const newErrors = {};
    
    if (!localQuestion.question?.trim()) {
      newErrors.question = 'Question is required';
    }
    
    if (!localQuestion.answer?.trim()) {
      newErrors.answer = 'Answer is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    const updated = { ...localQuestion, [field]: value };
    setLocalQuestion(updated);
    onChange(updated);
    
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleBlur = () => {
    validate();
  };

  return (
    <motion.div
      className="simple-question-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="question-header">
        <h3>Question {index + 1}</h3>
        <button
          className="btn-remove"
          onClick={onRemove}
          aria-label="Remove question"
          type="button"
        >
          ✕
        </button>
      </div>

      <div className="form-field">
        <label htmlFor={`question-${index}`}>
          Question <span className="required">*</span>
        </label>
        <textarea
          id={`question-${index}`}
          className={`form-textarea ${errors.question ? 'error' : ''}`}
          value={localQuestion.question}
          onChange={(e) => handleChange('question', e.target.value)}
          onBlur={handleBlur}
          placeholder="Enter your question"
          maxLength={500}
          rows={3}
          required
        />
        <div className="field-info">
          <span className="char-count">
            {localQuestion.question?.length || 0}/500
          </span>
          {errors.question && (
            <span className="error-message">{errors.question}</span>
          )}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor={`answer-${index}`}>
          Correct Answer <span className="required">*</span>
        </label>
        <textarea
          id={`answer-${index}`}
          className={`form-textarea ${errors.answer ? 'error' : ''}`}
          value={localQuestion.answer}
          onChange={(e) => handleChange('answer', e.target.value)}
          onBlur={handleBlur}
          placeholder="Enter the correct answer"
          maxLength={1000}
          rows={4}
          required
        />
        <div className="field-info">
          <span className="char-count">
            {localQuestion.answer?.length || 0}/1000
          </span>
          {errors.answer && (
            <span className="error-message">{errors.answer}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SimpleQuestionForm;
