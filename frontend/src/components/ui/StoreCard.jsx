import { motion } from 'framer-motion';
import { MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StarDisplay } from '../ui/RatingStars';
import { truncate } from '../../utils/helpers';

const StoreCard = ({ store, userRating, onRate, delay = 0 }) => {
  const avg = parseFloat(store.avgRating || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="card group relative overflow-hidden"
      whileHover={{ y: -3, boxShadow: '0 12px 36px rgba(0,0,0,0.12)' }}
    >
      {/* Store header / color band */}
      <div className="h-2 w-full bg-gradient-to-r from-primary-500 to-secondary-600" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 flex items-center justify-center text-xl flex-shrink-0">
            🏪
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-gray-900 dark:text-dark-text text-base truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {store.name}
            </h3>
            {store.email && (
              <p className="text-xs text-gray-500 dark:text-dark-muted truncate">{store.email}</p>
            )}
          </div>
        </div>

        {/* Address */}
        {store.address && (
          <div className="flex items-start gap-1.5 mb-4">
            <MapPin size={13} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 dark:text-dark-muted line-clamp-2">
              {truncate(store.address, 80)}
            </p>
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5">
              <StarDisplay rating={avg} size={15} />
              <span className="text-sm font-semibold text-gray-700 dark:text-dark-text">
                {avg > 0 ? avg.toFixed(1) : 'N/A'}
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-dark-muted mt-0.5">
              {store._count?.ratings || store.totalRatings || 0} reviews
            </p>
          </div>

          {userRating && (
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-medium text-gray-600 dark:text-dark-muted">Your rating: {userRating}</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/stores/${store.id}`}
            className="btn btn-outline btn-sm flex-1 text-center justify-center"
          >
            View Details
          </Link>
          {onRate && (
            <button
              onClick={() => onRate(store)}
              className="btn btn-primary btn-sm flex-1"
            >
              {userRating ? 'Edit Rating' : 'Rate Store'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StoreCard;
