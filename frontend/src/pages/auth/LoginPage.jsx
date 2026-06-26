import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/ui/Logo';
import PageTransition from '../../components/ui/PageTransition';
import { ROLES } from '../../utils/helpers';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', remember: false },
  });

  const from = location.state?.from?.pathname;
  const getRedirect = (role) => {
    if (from && !from.includes('/login')) return from;
    if (role === ROLES.ADMIN) return '/admin';
    if (role === ROLES.STORE_OWNER) return '/owner';
    return '/dashboard';
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await login(data);
      toast.success(`Welcome back, ${res.user.name.split(' ')[0]}!`);
      navigate(getRedirect(res.user.role), { replace: true });
    } catch (err) {
      toast.error(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass rounded-2xl border border-white/30 dark:border-dark-border/50 shadow-2xl p-8"
          >
            <div className="flex justify-center mb-6">
              <Logo size="md" />
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text">Welcome back</h1>
              <p className="text-sm text-gray-500 dark:text-dark-muted mt-1">Sign in to your RateHub account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div>
                <label className="label">Email address</label>
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={`input ${errors.email ? 'ring-2 ring-danger/50 border-danger' : ''}`}
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs text-danger mt-1"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={`input pr-11 ${errors.password ? 'ring-2 ring-danger/50 border-danger' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs text-danger mt-1"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    {...register('remember')}
                    type="checkbox"
                    className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-dark-muted">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg w-full text-base"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn size={18} />
                    Sign In
                  </span>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-dark-muted mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 font-medium hover:text-primary-700 transition-colors">
                Create one free
              </Link>
            </p>
          </motion.div>

          {/* Demo credentials hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 card p-4 text-xs text-center text-gray-500 dark:text-dark-muted"
          >
            <p className="font-medium text-gray-700 dark:text-dark-text mb-2">Demo Accounts</p>
            <div className="space-y-1">
              <p>Admin: <code className="text-primary-600">admin@ratehub.com</code> / <code className="text-primary-600">Admin@123</code></p>
              <p>User: <code className="text-primary-600">user@ratehub.com</code> / <code className="text-primary-600">User@123</code></p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoginPage;
