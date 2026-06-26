import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Save, Shield, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/ui/Avatar';
import PageTransition from '../components/ui/PageTransition';
import { getRoleLabel, formatDate } from '../utils/helpers';

const pwSchema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword: z
    .string()
    .min(8, 'Min 8 chars')
    .max(16, 'Max 16 chars')
    .regex(/[A-Z]/, 'Need uppercase')
    .regex(/[a-z]/, 'Need lowercase')
    .regex(/[0-9]/, 'Need a number')
    .regex(/[^A-Za-z0-9]/, 'Need special char'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const ProfilePage = () => {
  const { user } = useAuth();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(pwSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authAPI.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password updated successfully');
      reset();
    } catch (err) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const f = (field) => `input ${errors[field] ? 'ring-2 ring-danger/50 border-danger' : ''}`;

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text">Profile</h1>
        <p className="text-sm text-gray-500 dark:text-dark-muted mt-0.5">Manage your account information</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile info */}
        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 flex flex-col items-center text-center"
          >
            <Avatar name={user?.name} size="2xl" className="mb-4 ring-4 ring-primary-100 dark:ring-primary-900/30" />
            <h2 className="font-display font-bold text-gray-900 dark:text-dark-text text-lg">{user?.name}</h2>
            <p className="text-sm text-gray-500 dark:text-dark-muted">{user?.email}</p>
            <span className="badge badge-blue mt-2">{getRoleLabel(user?.role)}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-5 space-y-3"
          >
            <h3 className="font-semibold text-gray-800 dark:text-dark-text flex items-center gap-2">
              <User size={16} />
              Account Details
            </h3>
            {[
              { label: 'Full Name', val: user?.name },
              { label: 'Email', val: user?.email },
              { label: 'Role', val: getRoleLabel(user?.role) },
              { label: 'Address', val: user?.address || '—' },
              { label: 'Member Since', val: user?.createdAt ? formatDate(user.createdAt) : '—' },
            ].map(({ label, val }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-xs font-medium text-gray-400 dark:text-dark-muted uppercase tracking-wide">{label}</span>
                <span className="text-sm text-gray-700 dark:text-dark-text">{val}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Change password */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="card p-6"
          >
            <h3 className="font-semibold text-gray-800 dark:text-dark-text flex items-center gap-2 mb-5">
              <Shield size={16} className="text-primary-600" />
              Change Password
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
              {/* Current password */}
              <div>
                <label className="label">Current Password</label>
                <div className="relative">
                  <input
                    {...register('currentPassword')}
                    type={showCurrent ? 'text' : 'password'}
                    className={`${f('currentPassword')} pr-11`}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-xs text-danger mt-1">{errors.currentPassword.message}</p>
                )}
              </div>

              {/* New password */}
              <div>
                <label className="label">New Password</label>
                <div className="relative">
                  <input
                    {...register('newPassword')}
                    type={showNew ? 'text' : 'password'}
                    className={`${f('newPassword')} pr-11`}
                    placeholder="8–16 chars, uppercase, number, special"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-xs text-danger mt-1">{errors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="label">Confirm New Password</label>
                <input
                  {...register('confirmPassword')}
                  type="password"
                  className={f('confirmPassword')}
                  placeholder="Repeat new password"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-danger mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary btn-md gap-2">
                {loading ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                ) : (
                  <Save size={15} />
                )}
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProfilePage;
