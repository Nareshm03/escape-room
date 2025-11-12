import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PublishConfirmationModal.css';

const PublishConfirmationModal = ({ isOpen, onConfirm, onCancel, quizSummary }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <motion.div
          className="modal-content light-card"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2 id="modal-title">Ready to publish?</h2>
            <button
              className="modal-close"
              onClick={onCancel}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          <div className="modal-body">
            <div className="quiz-summary">
              <div className="summary-item">
                <span className="summary-label">Title:</span>
                <span className="summary-value">{quizSummary.title}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Description:</span>
                <span className="summary-value">{quizSummary.description}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Duration:</span>
                <span className="summary-value">{quizSummary.duration} minutes</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Questions:</span>
                <span className="summary-value">{quizSummary.questionCount}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total Points:</span>
                <span className="summary-value">{quizSummary.totalPoints}</span>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button
              className="btn btn-secondary"
              onClick={onCancel}
              aria-label="Cancel publishing"
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={onConfirm}
              aria-label="Confirm and publish quiz"
            >
              ✓ Publish
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PublishConfirmationModal;
