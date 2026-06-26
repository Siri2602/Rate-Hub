import { useEffect, useState, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { ratingsAPI } from '../../services/api';
import Table from '../../components/ui/Table';
import { ConfirmModal } from '../../components/ui/Modal';
import PageTransition from '../../components/ui/PageTransition';
import { StarDisplay } from '../../components/ui/RatingStars';
import Avatar from '../../components/ui/Avatar';
import { formatDate } from '../../utils/helpers';

const AdminRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, rating: null, loading: false });

  const fetchRatings = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await ratingsAPI.getAll();
      setRatings(data.ratings || data);
    } catch {
      toast.error('Failed to load ratings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRatings(); }, [fetchRatings]);

  const handleDelete = async () => {
    setDeleteModal(d => ({ ...d, loading: true }));
    try {
      await ratingsAPI.delete(deleteModal.rating.id);
      toast.success('Rating deleted');
      fetchRatings();
    } catch {
      toast.error('Failed to delete rating');
    } finally {
      setDeleteModal({ open: false, rating: null, loading: false });
    }
  };

  const columns = [
    {
      header: 'User',
      accessor: 'user',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Avatar name={row.user?.name} size="sm" />
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-dark-text">{row.user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-dark-muted">{row.user?.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Store',
      accessor: 'store',
      cell: (row) => (
        <span className="text-sm font-medium text-gray-700 dark:text-dark-text">{row.store?.name || '—'}</span>
      ),
    },
    {
      header: 'Rating',
      accessor: 'rating',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <StarDisplay rating={row.rating} size={14} />
          <span className="text-sm font-semibold text-gray-700 dark:text-dark-text">{row.rating}</span>
        </div>
      ),
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      cell: (row) => (
        <span className="text-xs text-gray-500 dark:text-dark-muted">{formatDate(row.createdAt)}</span>
      ),
    },
    {
      header: 'Actions',
      sortable: false,
      cell: (row) => (
        <button
          onClick={() => setDeleteModal({ open: true, rating: row, loading: false })}
          className="btn btn-ghost btn-sm p-1.5 text-danger"
          aria-label="Delete rating"
        >
          <Trash2 size={14} />
        </button>
      ),
    },
  ];

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text">Ratings</h1>
        <p className="text-sm text-gray-500 dark:text-dark-muted mt-0.5">{ratings.length} total ratings</p>
      </div>

      <div className="card p-5">
        <Table
          columns={columns}
          data={ratings}
          loading={loading}
          exportable
          exportFilename="ratehub-ratings"
          emptyMessage="No ratings found"
        />
      </div>

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, rating: null, loading: false })}
        onConfirm={handleDelete}
        loading={deleteModal.loading}
        title="Delete Rating"
        message={`Delete rating of ${deleteModal.rating?.rating}★ by "${deleteModal.rating?.user?.name}" for "${deleteModal.rating?.store?.name}"?`}
      />
    </PageTransition>
  );
};

export default AdminRatings;
