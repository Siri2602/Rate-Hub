import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Modal from './Modal';
import RatingStars from './RatingStars';
import { ratingsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Confetti = () => {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ['#FBBF24', '#2563EB', '#7C3AED', '#22C55E', '#EF4444'][i % 5],
    delay: Math.random() * 0.5,
    size: 6 + Math.random() * 8,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{ left: `${p.x}%`, top: '-10px', width: p.size, height: p.size, background: p.color }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{ y: 300, opacity: 0, rotate: 720 }}
          transition={{ duration: 1.5, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
};

const RatingModal = ({ isOpen, onClose, store, existingRating, onSuccess }) => {
  const [rating, setRating] = useState(existingRating?.rating || 0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRating(existingRating?.rating || 0);
      setSubmitted(false);
    }
  }, [isOpen, existingRating]);

  const handleSubmit = async () => {
    if (!rating) {
      toast.error('Please select a rating');
      return;
    }
    setLoading(true);
    try {
      if (existingRating) {
        await ratingsAPI.update(existingRating.id, { rating });
        toast.success('Rating updated!');
      } else {
        await ratingsAPI.submit({ storeId: store.id, rating });
        setSubmitted(true);
      }
      onSuccess?.();
      if (existingRating) onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={existingRating ? 'Update Your Rating' : `Rate ${store?.name}`}
      size="sm"
      footer={
        !submitted && (
          <>
            <button className="btn btn-outline btn-md" onClick={onClose}>Cancel</button>
            <button
              className="btn btn-primary btn-md"
              onClick={handleSubmit}
              disabled={loading || !rating}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                  Submitting...
                </span>
              ) : existingRating ? 'Update Rating' : 'Submit Rating'}
            </button>
          </>
        )
      }
    >
      <div className="relative">
        <AnimatePresence>
          {submitted && <Confetti />}
        </AnimatePresence>

        {submitted ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-4 py-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
            >
              <CheckCircle size={56} className="text-success" />
            </motion.div>
            <div className="text-center">
              <h3 className="font-display font-semibold text-gray-900 dark:text-dark-text text-lg">
                Thank you!
              </h3>
              <p className="text-sm text-gray-500 dark:text-dark-muted mt-1">
                Your {rating}-star rating for <strong>{store?.name}</strong> has been submitted.
              </p>
            </div>
            <button className="btn btn-primary btn-md" onClick={onClose}>Done</button>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-5 py-4">
            <div className="text-5xl">🏪</div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-dark-muted">
                How would you rate your experience at
              </p>
              <p className="font-semibold text-gray-900 dark:text-dark-text">{store?.name}?</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <RatingStars value={rating} onChange={setRating} size={36} />
              <p className="text-sm text-gray-500 dark:text-dark-muted min-h-[1.25rem]">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent!'}
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default RatingModal;
