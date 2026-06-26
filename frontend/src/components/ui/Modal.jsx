import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/helpers';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer,
  className = '',
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={cn(
              'relative w-full bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-gray-100 dark:border-dark-border',
              sizes[size],
              className
            )}
          >
            {/* Header */}
            {(title || onClose) && (
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-dark-border">
                {title && (
                  <h2 id="modal-title" className="text-lg font-display font-semibold text-gray-900 dark:text-dark-text">
                    {title}
                  </h2>
                )}
                {onClose && (
                  <button
                    onClick={onClose}
                    className="ml-auto p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg text-gray-400 hover:text-gray-600 dark:hover:text-dark-muted transition-colors"
                    aria-label="Close modal"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="p-5">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="flex items-center justify-end gap-3 px-5 pb-5">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, loading, danger = true }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title || 'Confirm Action'}
    size="sm"
    footer={
      <>
        <button className="btn btn-outline btn-md" onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button
          className={cn('btn btn-md', danger ? 'btn-danger' : 'btn-primary')}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
              Processing...
            </span>
          ) : 'Confirm'}
        </button>
      </>
    }
  >
    <p className="text-gray-600 dark:text-dark-muted">{message}</p>
  </Modal>
);

export default Modal;
