import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Mail } from 'lucide-react';
import { storesAPI, ratingsAPI } from '../../services/api';
import { StarDisplay } from '../../components/ui/RatingStars';
import RatingModal from '../../components/ui/RatingModal';
import PageTransition from '../../components/ui/PageTransition';
import Avatar from '../../components/ui/Avatar';
import { formatDate } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const StoreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratingModal, setRatingModal] = useState(false);

  const fetchStore = async () => {
    try {
      const [storeRes, ratingsRes] = await Promise.all([
        storesAPI.getById(id),
        ratingsAPI.getByStore(id),
      ]);
      setStore(storeRes.data.store || storeRes.data);
      const rList = ratingsRes.data.ratings || ratingsRes.data;
      setRatings(rList);
    } catch {
      toast.error('Store not found');
      navigate('/stores');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRating = async () => {
    if (!isAuthenticated) return;
    try {
      const { data } = await ratingsAPI.getUserRatings();
      const my = (data.ratings || data).find(r => r.storeId === id);
      setUserRating(my || null);
    } catch {}
  };

  useEffect(() => {
    fetchStore();
    fetchUserRating();
  }, [id]);

  const handleRateSuccess = () => {
    fetchStore();
    fetchUserRating();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!store) return null;

  const avg = parseFloat(store.avgRating || 0);
  const dist = [5, 4, 3, 2, 1].map(n => ({
    star: n,
    count: ratings.filter(r => r.rating === n).length,
  }));
  const total = ratings.length;

  return (
    <PageTransition>
      {/* Back */}
      <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm gap-1.5 mb-6 -ml-1">
        <ArrowLeft size={16} />
        Back to Stores
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Store info */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 flex items-center justify-center text-3xl flex-shrink-0">
                🏪
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text">{store.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <StarDisplay rating={avg} size={16} />
                  <span className="font-semibold text-gray-700 dark:text-dark-text">{avg > 0 ? avg.toFixed(1) : 'N/A'}</span>
                  <span className="text-sm text-gray-400 dark:text-dark-muted">({total} reviews)</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              {store.email && (
                <div className="flex items-center gap-2 text-gray-500 dark:text-dark-muted">
                  <Mail size={14} className="flex-shrink-0" />
                  <span>{store.email}</span>
                </div>
              )}
              {store.address && (
                <div className="flex items-start gap-2 text-gray-500 dark:text-dark-muted">
                  <MapPin size={14} className="flex-shrink-0 mt-0.5" />
                  <span>{store.address}</span>
                </div>
              )}
            </div>

            {isAuthenticated && (
              <div className="mt-5 pt-5 border-t border-gray-100 dark:border-dark-border">
                {userRating ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-dark-text">Your rating</p>
                      <StarDisplay rating={userRating.rating} size={18} showValue />
                    </div>
                    <button onClick={() => setRatingModal(true)} className="btn btn-outline btn-md">
                      Update Rating
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setRatingModal(true)} className="btn btn-primary btn-md w-full">
                    ⭐ Rate This Store
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="card p-5">
            <h2 className="font-semibold text-gray-800 dark:text-dark-text mb-4">Customer Reviews</h2>
            {ratings.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <div className="text-4xl mb-2">💬</div>
                <p className="text-sm">No reviews yet. Be the first!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ratings.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-3 py-4 border-b border-gray-50 dark:border-dark-border last:border-0"
                  >
                    <Avatar name={r.user?.name} size="md" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-800 dark:text-dark-text">{r.user?.name}</p>
                        <span className="text-xs text-gray-400 dark:text-dark-muted">{formatDate(r.createdAt)}</span>
                      </div>
                      <StarDisplay rating={r.rating} size={14} />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rating distribution */}
        <div className="space-y-5">
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 dark:text-dark-text mb-4">Rating Breakdown</h3>
            <div className="text-center mb-5">
              <p className="text-5xl font-display font-bold text-gray-900 dark:text-dark-text">
                {avg > 0 ? avg.toFixed(1) : '—'}
              </p>
              <StarDisplay rating={avg} size={18} />
              <p className="text-xs text-gray-400 dark:text-dark-muted mt-1">{total} reviews</p>
            </div>
            <div className="space-y-2">
              {dist.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500 dark:text-dark-muted w-4">{star}</span>
                  <span className="text-yellow-500">★</span>
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-dark-border rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-yellow-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
                      transition={{ duration: 0.8, delay: (5 - star) * 0.1 }}
                    />
                  </div>
                  <span className="text-gray-400 dark:text-dark-muted w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <RatingModal
        isOpen={ratingModal}
        onClose={() => setRatingModal(false)}
        store={store}
        existingRating={userRating}
        onSuccess={handleRateSuccess}
      />
    </PageTransition>
  );
};

export default StoreDetail;
