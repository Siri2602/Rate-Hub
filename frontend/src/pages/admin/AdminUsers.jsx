import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { usersAPI } from '../../services/api';
import Table from '../../components/ui/Table';
import Modal, { ConfirmModal } from '../../components/ui/Modal';
import Avatar from '../../components/ui/Avatar';
import PageTransition from '../../components/ui/PageTransition';
import { formatDate, getRoleLabel, getRoleColor } from '../../utils/helpers';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ROLES } from '../../utils/helpers';

const userSchema = z.object({
  name: z.string().min(20, 'Min 20 chars').max(60, 'Max 60 chars'),
  email: z.string().email('Valid email required'),
  address: z.string().min(5).max(400),
  role: z.enum([ROLES.ADMIN, ROLES.STORE_OWNER, ROLES.USER]),
  password: z.string().min(8).max(16).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/).optional().or(z.literal('')),
});

const UserForm = ({ user, onSave, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(user ? userSchema.omit({ password: true }) : userSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      address: user?.address || '',
      role: user?.role || ROLES.USER,
      password: '',
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (user) {
        await usersAPI.update(user.id, data);
        toast.success('User updated');
      } else {
        await usersAPI.create(data);
        toast.success('User created');
      }
      onSave();
    } catch (err) {
      toast.error(err.message || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const f = (field) => `input ${errors[field] ? 'ring-2 ring-danger/50 border-danger' : ''}`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label">Full Name <span className="text-gray-400 text-xs">(20–60 chars)</span></label>
        <input {...register('name')} className={f('name')} placeholder="Full name" />
        {errors.name && <p className="text-xs text-danger mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="label">Email</label>
        <input {...register('email')} type="email" className={f('email')} placeholder="Email address" />
        {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="label">Address</label>
        <textarea {...register('address')} rows={2} className={f('address')} placeholder="Address" />
        {errors.address && <p className="text-xs text-danger mt-1">{errors.address.message}</p>}
      </div>
      <div>
        <label className="label">Role</label>
        <select {...register('role')} className={f('role')}>
          <option value={ROLES.USER}>User</option>
          <option value={ROLES.STORE_OWNER}>Store Owner</option>
          <option value={ROLES.ADMIN}>Admin</option>
        </select>
      </div>
      {!user && (
        <div>
          <label className="label">Password</label>
          <input {...register('password')} type="password" className={f('password')} placeholder="Min 8 chars, uppercase, number, special" />
          {errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
        </div>
      )}
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onClose} className="btn btn-outline btn-md">Cancel</button>
        <button type="submit" disabled={loading} className="btn btn-primary btn-md">
          {loading ? 'Saving...' : user ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formModal, setFormModal] = useState({ open: false, user: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null, loading: false });
  const [viewModal, setViewModal] = useState({ open: false, user: null });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await usersAPI.getAll();
      setUsers(data.users || data);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async () => {
    setDeleteModal(d => ({ ...d, loading: true }));
    try {
      await usersAPI.delete(deleteModal.user.id);
      toast.success('User deleted');
      fetchUsers();
    } catch {
      toast.error('Failed to delete user');
    } finally {
      setDeleteModal({ open: false, user: null, loading: false });
    }
  };

  const columns = [
    {
      header: 'User',
      accessor: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-dark-text">{row.name}</p>
            <p className="text-xs text-gray-500 dark:text-dark-muted">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessor: 'role',
      cell: (row) => (
        <span className={getRoleColor(row.role)}>{getRoleLabel(row.role)}</span>
      ),
    },
    {
      header: 'Address',
      accessor: 'address',
      sortable: false,
      cell: (row) => (
        <span className="text-gray-500 dark:text-dark-muted text-xs">{row.address?.slice(0, 40) || '—'}{row.address?.length > 40 ? '...' : ''}</span>
      ),
    },
    {
      header: 'Joined',
      accessor: 'createdAt',
      cell: (row) => (
        <span className="text-gray-500 dark:text-dark-muted text-xs">{formatDate(row.createdAt)}</span>
      ),
    },
    {
      header: 'Actions',
      sortable: false,
      cell: (row) => (
        <div className="flex items-center gap-1">
          <button onClick={() => setViewModal({ open: true, user: row })} className="btn btn-ghost btn-sm p-1.5" aria-label="View">
            <Eye size={14} />
          </button>
          <button onClick={() => setFormModal({ open: true, user: row })} className="btn btn-ghost btn-sm p-1.5" aria-label="Edit">
            <Pencil size={14} />
          </button>
          <button onClick={() => setDeleteModal({ open: true, user: row, loading: false })} className="btn btn-ghost btn-sm p-1.5 text-danger hover:text-danger" aria-label="Delete">
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
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text">Users</h1>
          <p className="text-sm text-gray-500 dark:text-dark-muted mt-0.5">{users.length} total users</p>
        </div>
        <button onClick={() => setFormModal({ open: true, user: null })} className="btn btn-primary btn-md gap-2">
          <Plus size={16} />
          Add User
        </button>
      </div>

      <div className="card p-5">
        <Table
          columns={columns}
          data={users}
          loading={loading}
          exportable
          exportFilename="ratehub-users"
          emptyMessage="No users found"
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, user: null })}
        title={formModal.user ? 'Edit User' : 'Add New User'}
      >
        <UserForm
          user={formModal.user}
          onSave={() => { setFormModal({ open: false, user: null }); fetchUsers(); }}
          onClose={() => setFormModal({ open: false, user: null })}
        />
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={viewModal.open}
        onClose={() => setViewModal({ open: false, user: null })}
        title="User Details"
        size="sm"
      >
        {viewModal.user && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={viewModal.user.name} size="xl" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-dark-text">{viewModal.user.name}</h3>
                <span className={getRoleColor(viewModal.user.role)}>{getRoleLabel(viewModal.user.role)}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Email', val: viewModal.user.email },
                { label: 'Joined', val: formatDate(viewModal.user.createdAt) },
                { label: 'Address', val: viewModal.user.address || '—' },
              ].map(({ label, val }) => (
                <div key={label} className="col-span-2">
                  <p className="text-xs text-gray-400 dark:text-dark-muted font-medium uppercase tracking-wide">{label}</p>
                  <p className="text-gray-800 dark:text-dark-text">{val}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, user: null, loading: false })}
        onConfirm={handleDelete}
        loading={deleteModal.loading}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteModal.user?.name}"? This action cannot be undone.`}
      />
    </PageTransition>
  );
};

export default AdminUsers;
