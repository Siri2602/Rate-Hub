import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { ratingsAPI } from '../../services/api';
import { StarDisplay } from '../../components/ui/RatingStars';
import RatingModal from '../../components/ui/RatingModal';
import { ConfirmModal } from '../../components/ui/Modal';
import PageTransition from '../../components/ui/PageTransition';
import EmptyState from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { formatDate } from '../../utils/helpers';

const MyRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState({ open: false, rating: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, rating: null, loading: false });

  const fetchRatings = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await ratingsAPI.getUserRatings();
      setRatings(data.ratings || data);
    } catch {
      toast.error('Failed to load your ratings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRatings(); }, [fetchRatings]);

  const handleDelete = async () => {
    setDeleteModal(d => ({ ...d, loading: true }));
    try {
      await ratingsAPI.delete(deleteModal.rating.id);
      toast.success('Rating removed');
      fetchRatings();
    } catch {
      toast.error('Failed to delete rating');
    } finally {
      setDeleteModal({ open: false, rating: null, loading: false });
    }
  };

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text">My Ratings</h1>
        <p className="text-sm text-gray-500 dark:text-dark-muted mt-0.5">
          {ratings.length} store{ratings.length !== 1 ? 's' : ''} rated
        </p>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : ratings.length === 0 ? (
        <EmptyState
          preset="ratings"
          action={<Link to="/stores" className="btn btn-primary btn-md">Discover Stores</Link>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ratings.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-hover p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 flex items-center justify-center text-lg flex-shrink-0">
                    🏪
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-dark-text text-sm">
                      {r.store?.name}
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-dark-muted">{formatDate(r.createdAt)}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditModal({ open: true, rating: r })}
                    className="btn btn-ghost btn-sm p-1.5"
                    aria-label="Edit rating"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ open: true, rating: r, loading: false })}
                    className="btn btn-ghost btn-sm p-1.5 text-danger"
                    aria-label="Delete rating"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <StarDisplay rating={r.rating} size={18} showValue />

              {r.store?.address && (
                <p className="text-xs text-gray-400 dark:text-dark-muted mt-2 truncate">
                  📍 {r.store.address}
                </p>
              )}

              <Link
                to={`/stores/${r.storeId}`}
                className="btn btn-outline btn-sm w-full mt-3 text-xs"
              >
                View Store
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit rating modal */}
      <RatingModal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, rating: null })}
        store={editModal.rating?.store}
        existingRating={editModal.rating}
        onSuccess={() => { setEditModal({ open: false, rating: null }); fetchRatings(); }}
      />

      {/* Delete confirm */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, rating: null, loading: false })}
        onConfirm={handleDelete}
        loading={deleteModal.loading}
        title="Remove Rating"
        message={`Remove your rating for "${deleteModal.rating?.store?.name}"?`}
      />
    </PageTransition>
  );
};

export default MyRatings;
