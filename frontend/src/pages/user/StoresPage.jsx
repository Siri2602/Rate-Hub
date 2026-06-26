import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Star, X } from 'lucide-react';
import { storesAPI, ratingsAPI } from '../../services/api';
import StoreCard from '../../components/ui/StoreCard';
import RatingModal from '../../components/ui/RatingModal';
import PageTransition from '../../components/ui/PageTransition';
import { CardSkeleton } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { debounce } from '../../utils/helpers';
import toast from 'react-hot-toast';

const SORT_OPTIONS = [
  { value: 'name_asc', label: 'Name A–Z' },
  { value: 'name_desc', label: 'Name Z–A' },
  { value: 'rating_desc', label: 'Highest Rated' },
  { value: 'rating_asc', label: 'Lowest Rated' },
  { value: 'newest', label: 'Newest First' },
];

const FILTER_OPTIONS = [
  { value: '', label: 'All Ratings' },
  { value: '4', label: '4★ & above' },
  { value: '3', label: '3★ & above' },
  { value: '2', label: '2★ & above' },
];

const StoresPage = () => {
  const { isAuthenticated } = useAuth();
  const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name_asc');
  const [minRating, setMinRating] = useState('');
  const [ratingModal, setRatingModal] = useState({ open: false, store: null });
  const searchRef = useRef(null);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await storesAPI.getAll({ search, sort, minRating });
      setStores(data.stores || data);
    } catch {
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  }, [search, sort, minRating]);

  const fetchUserRatings = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const { data } = await ratingsAPI.getUserRatings();
      const map = {};
      (data.ratings || data).forEach(r => { map[r.storeId] = r; });
      setUserRatings(map);
    } catch {}
  }, [isAuthenticated]);

  useEffect(() => { fetchStores(); }, [fetchStores]);
  useEffect(() => { fetchUserRatings(); }, [fetchUserRatings]);

  const debouncedSearch = useCallback(debounce((val) => setSearch(val), 300), []);

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const clearFilters = () => {
    setSearch('');
    setSort('name_asc');
    setMinRating('');
    if (searchRef.current) searchRef.current.value = '';
  };

  const hasFilters = search || sort !== 'name_asc' || minRating;

  const handleRateSuccess = () => {
    fetchUserRatings();
    fetchStores();
  };

  return (
    <PageTransition>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text">Discover Stores</h1>
        <p className="text-sm text-gray-500 dark:text-dark-muted mt-0.5">
          {loading ? 'Loading...' : `${stores.length} stores available`}
        </p>
      </div>

      {/* Search & Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search stores by name or address..."
              onChange={handleSearchChange}
              className="input pl-9 w-full"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1">
            <SlidersHorizontal size={14} className="text-gray-400" />
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="input py-2 pr-8 text-sm w-auto min-w-[140px]"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Rating filter */}
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-500" />
            <select
              value={minRating}
              onChange={e => setMinRating(e.target.value)}
              className="input py-2 pr-8 text-sm w-auto min-w-[130px]"
            >
              {FILTER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Clear */}
          <AnimatePresence>
            {hasFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={clearFilters}
                className="btn btn-ghost btn-sm gap-1.5 text-gray-500"
              >
                <X size={14} />
                Clear
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 9 }, (_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : stores.length === 0 ? (
        <EmptyState
          preset="stores"
          action={hasFilters && (
            <button onClick={clearFilters} className="btn btn-primary btn-md">Clear Filters</button>
          )}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {stores.map((store, i) => (
              <StoreCard
                key={store.id}
                store={store}
                userRating={userRatings[store.id]?.rating}
                onRate={isAuthenticated ? (s) => setRatingModal({ open: true, store: s }) : undefined}
                delay={Math.min(i * 0.04, 0.3)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Rating Modal */}
      <RatingModal
        isOpen={ratingModal.open}
        onClose={() => setRatingModal({ open: false, store: null })}
        store={ratingModal.store}
        existingRating={ratingModal.store ? userRatings[ratingModal.store.id] : null}
        onSuccess={handleRateSuccess}
      />
    </PageTransition>
  );
};

export default StoresPage;
