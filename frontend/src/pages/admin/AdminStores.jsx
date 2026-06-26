import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Eye, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { storesAPI, usersAPI } from '../../services/api';
import Table from '../../components/ui/Table';
import Modal, { ConfirmModal } from '../../components/ui/Modal';
import PageTransition from '../../components/ui/PageTransition';
import { StarDisplay } from '../../components/ui/RatingStars';
import { formatDate, truncate } from '../../utils/helpers';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const storeSchema = z.object({
  name: z.string().min(20, 'Min 20 chars').max(60, 'Max 60 chars'),
  email: z.string().email('Valid email required'),
  address: z.string().min(5).max(400),
  ownerId: z.string().optional(),
});

const StoreForm = ({ store, owners = [], onSave, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: store?.name || '',
      email: store?.email || '',
      address: store?.address || '',
      ownerId: store?.ownerId || '',
    },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (store) {
        await storesAPI.update(store.id, data);
        toast.success('Store updated');
      } else {
        await storesAPI.create(data);
        toast.success('Store created');
      }
      onSave();
    } catch (err) {
      toast.error(err.message || 'Failed to save store');
    } finally {
      setLoading(false);
    }
  };

  const f = (field) => `input ${errors[field] ? 'ring-2 ring-danger/50 border-danger' : ''}`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label">Store Name <span className="text-gray-400 text-xs">(20–60 chars)</span></label>
        <input {...register('name')} className={f('name')} placeholder="Store name" />
        {errors.name && <p className="text-xs text-danger mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="label">Store Email</label>
        <input {...register('email')} type="email" className={f('email')} placeholder="store@example.com" />
        {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="label">Address</label>
        <textarea {...register('address')} rows={2} className={f('address')} placeholder="Store address" />
        {errors.address && <p className="text-xs text-danger mt-1">{errors.address.message}</p>}
      </div>
      {owners.length > 0 && (
        <div>
          <label className="label">Owner (optional)</label>
          <select {...register('ownerId')} className="input">
            <option value="">None</option>
            {owners.map(o => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
        </div>
      )}
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onClose} className="btn btn-outline btn-md">Cancel</button>
        <button type="submit" disabled={loading} className="btn btn-primary btn-md">
          {loading ? 'Saving...' : store ? 'Update Store' : 'Create Store'}
        </button>
      </div>
    </form>
  );
};

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formModal, setFormModal] = useState({ open: false, store: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, store: null, loading: false });
  const [viewModal, setViewModal] = useState({ open: false, store: null });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [storesRes, usersRes] = await Promise.all([
        storesAPI.getAll(),
        usersAPI.getAll({ role: 'STORE_OWNER' }),
      ]);
      setStores(storesRes.data.stores || storesRes.data);
      setOwners((usersRes.data.users || usersRes.data).filter(u => u.role === 'STORE_OWNER'));
    } catch {
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleDelete = async () => {
    setDeleteModal(d => ({ ...d, loading: true }));
    try {
      await storesAPI.delete(deleteModal.store.id);
      toast.success('Store deleted');
      fetchAll();
    } catch {
      toast.error('Failed to delete store');
    } finally {
      setDeleteModal({ open: false, store: null, loading: false });
    }
  };

  const columns = [
    {
      header: 'Store',
      accessor: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 flex items-center justify-center text-base flex-shrink-0">
            🏪
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-dark-text">{row.name}</p>
            <p className="text-xs text-gray-500 dark:text-dark-muted">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Address',
      accessor: 'address',
      sortable: false,
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-dark-muted">
          <MapPin size={11} />
          <span>{truncate(row.address, 50)}</span>
        </div>
      ),
    },
    {
      header: 'Owner',
      accessor: 'owner',
      sortable: false,
      cell: (row) => (
        <span className="text-sm text-gray-600 dark:text-dark-muted">{row.owner?.name || '—'}</span>
      ),
    },
    {
      header: 'Rating',
      accessor: 'avgRating',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <StarDisplay rating={parseFloat(row.avgRating || 0)} size={13} />
          <span className="text-xs font-medium text-gray-600 dark:text-dark-muted">
            {row.avgRating ? parseFloat(row.avgRating).toFixed(1) : '—'}
          </span>
        </div>
      ),
    },
    {
      header: 'Reviews',
      accessor: '_count',
      cell: (row) => (
        <span className="badge badge-blue">{row._count?.ratings || 0}</span>
      ),
    },
    {
      header: 'Created',
      accessor: 'createdAt',
      cell: (row) => (
        <span className="text-xs text-gray-400 dark:text-dark-muted">{formatDate(row.createdAt)}</span>
      ),
    },
    {
      header: 'Actions',
      sortable: false,
      cell: (row) => (
        <div className="flex items-center gap-1">
          <button onClick={() => setViewModal({ open: true, store: row })} className="btn btn-ghost btn-sm p-1.5">
            <Eye size={14} />
          </button>
          <button onClick={() => setFormModal({ open: true, store: row })} className="btn btn-ghost btn-sm p-1.5">
            <Pencil size={14} />
          </button>
          <button onClick={() => setDeleteModal({ open: true, store: row, loading: false })} className="btn btn-ghost btn-sm p-1.5 text-danger">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text">Stores</h1>
          <p className="text-sm text-gray-500 dark:text-dark-muted mt-0.5">{stores.length} stores listed</p>
        </div>
        <button onClick={() => setFormModal({ open: true, store: null })} className="btn btn-primary btn-md gap-2">
          <Plus size={16} />
          Add Store
        </button>
      </div>

      <div className="card p-5">
        <Table
          columns={columns}
          data={stores}
          loading={loading}
          exportable
          exportFilename="ratehub-stores"
          emptyMessage="No stores found"
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, store: null })}
        title={formModal.store ? 'Edit Store' : 'Add New Store'}
      >
        <StoreForm
          store={formModal.store}
          owners={owners}
          onSave={() => { setFormModal({ open: false, store: null }); fetchAll(); }}
          onClose={() => setFormModal({ open: false, store: null })}
        />
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={viewModal.open}
        onClose={() => setViewModal({ open: false, store: null })}
        title="Store Details"
        size="sm"
      >
        {viewModal.store && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🏪</div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-dark-text">{viewModal.store.name}</h3>
                <StarDisplay rating={parseFloat(viewModal.store.avgRating || 0)} size={14} showValue />
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Email', val: viewModal.store.email },
                { label: 'Owner', val: viewModal.store.owner?.name || 'None' },
                { label: 'Total Reviews', val: viewModal.store._count?.ratings || 0 },
                { label: 'Address', val: viewModal.store.address },
                { label: 'Created', val: formatDate(viewModal.store.createdAt) },
              ].map(({ label, val }) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 dark:text-dark-muted uppercase tracking-wide font-medium">{label}</p>
                  <p className="text-gray-800 dark:text-dark-text">{val}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, store: null, loading: false })}
        onConfirm={handleDelete}
        loading={deleteModal.loading}
        title="Delete Store"
        message={`Are you sure you want to delete "${deleteModal.store?.name}"? All ratings for this store will be permanently removed.`}
      />
    </PageTransition>
  );
};

export default AdminStores;
