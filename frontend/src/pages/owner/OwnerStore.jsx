import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Save, Store } from 'lucide-react';
import toast from 'react-hot-toast';
import { storesAPI } from '../../services/api';
import PageTransition from '../../components/ui/PageTransition';
import { StarDisplay } from '../../components/ui/RatingStars';

const schema = z.object({
  name: z.string().min(20, 'Min 20 chars').max(60, 'Max 60 chars'),
  email: z.string().email('Valid email required'),
  address: z.string().min(5).max(400),
});

const OwnerStore = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    storesAPI.getMyStore()
      .then(res => {
        const s = res.data.store || res.data;
        setStore(s);
        reset({ name: s.name, email: s.email, address: s.address });
      })
      .catch(() => toast.error('No store found for your account'))
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await storesAPI.update(store.id, data);
      toast.success('Store updated successfully');
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!store) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="text-5xl animate-float">🏪</div>
          <p className="text-gray-500 dark:text-dark-muted">No store associated with your account.</p>
          <p className="text-sm text-gray-400 dark:text-dark-muted">Please contact an admin to set up your store.</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text">My Store</h1>
        <p className="text-sm text-gray-500 dark:text-dark-muted mt-0.5">Manage your store information</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Store card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 flex flex-col items-center text-center gap-3"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 flex items-center justify-center text-4xl">
            🏪
          </div>
          <div>
            <h2 className="font-display font-bold text-gray-900 dark:text-dark-text text-lg">{store.name}</h2>
            <p className="text-sm text-gray-500 dark:text-dark-muted">{store.email}</p>
          </div>
          <div>
            <StarDisplay rating={parseFloat(store.avgRating || 0)} size={18} showValue />
            <p className="text-xs text-gray-400 dark:text-dark-muted mt-1">
              {store._count?.ratings || 0} reviews
            </p>
          </div>
        </motion.div>

        {/* Edit form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <h3 className="font-semibold text-gray-800 dark:text-dark-text flex items-center gap-2 mb-5">
              <Store size={16} className="text-primary-600" />
              Store Information
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="label">Store Name <span className="text-gray-400 text-xs">(20–60 chars)</span></label>
                <input {...register('name')} className={`input ${errors.name ? 'ring-2 ring-danger/50 border-danger' : ''}`} />
                {errors.name && <p className="text-xs text-danger mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="label">Store Email</label>
                <input {...register('email')} type="email" className={`input ${errors.email ? 'ring-2 ring-danger/50 border-danger' : ''}`} />
                {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="label">Address <span className="text-gray-400 text-xs">(max 400 chars)</span></label>
                <textarea {...register('address')} rows={3} className={`input ${errors.address ? 'ring-2 ring-danger/50 border-danger' : ''}`} />
                {errors.address && <p className="text-xs text-danger mt-1">{errors.address.message}</p>}
              </div>

              <button type="submit" disabled={saving} className="btn btn-primary btn-md gap-2">
                {saving ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                ) : <Save size={15} />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default OwnerStore;
