import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ratingsAPI, storesAPI } from '../../services/api';
import { StarDisplay } from '../../components/ui/RatingStars';
import Avatar from '../../components/ui/Avatar';
import PageTransition from '../../components/ui/PageTransition';
import EmptyState from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const OwnerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const storeRes = await storesAPI.getMyStore();
      const s = storeRes.data.store || storeRes.data;
      setStore(s);
      const ratingsRes = await ratingsAPI.getByStore(s.id);
      setReviews(ratingsRes.data.ratings || ratingsRes.data);
    } catch {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text">Customer Reviews</h1>
        <p className="text-sm text-gray-500 dark:text-dark-muted mt-0.5">
          {reviews.length} review{reviews.length !== 1 ? 's' : ''} for {store?.name || 'your store'}
        </p>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState preset="reviews" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.3) }}
              className="card-hover p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={r.user?.name} size="md" />
                <div>
                  <p className="font-medium text-gray-800 dark:text-dark-text text-sm">{r.user?.name}</p>
                  <p className="text-xs text-gray-400 dark:text-dark-muted">{formatDate(r.createdAt)}</p>
                </div>
              </div>
              <StarDisplay rating={r.rating} size={18} showValue />
            </motion.div>
          ))}
        </div>
      )}
    </PageTransition>
  );
};

export default OwnerReviews;
