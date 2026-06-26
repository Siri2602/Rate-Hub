import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UserPlus, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/ui/Logo';
import PageTransition from '../../components/ui/PageTransition';
import { ROLES } from '../../utils/helpers';

const schema = z.object({
  name: z.string().min(20, 'Name must be at least 20 characters').max(60, 'Name must be at most 60 characters'),
  email: z.string().email('Enter a valid email'),
  address: z.string().min(5, 'Address is required').max(400, 'Address too long'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .max(16, 'At most 16 characters')
    .regex(/[A-Z]/, 'Must include uppercase')
    .regex(/[a-z]/, 'Must include lowercase')
    .regex(/[0-9]/, 'Must include a number')
    .regex(/[^A-Za-z0-9]/, 'Must include a special character'),
  role: z.enum([ROLES.USER, ROLES.STORE_OWNER]),
});

const PasswordStrength = ({ password }) => {
  const checks = [
    { label: 'At least 8 characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', ok: /[a-z]/.test(password) },
    { label: 'Number', ok: /[0-9]/.test(password) },
    { label: 'Special character', ok: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = checks.filter(c => c.ok).length;
  const colors = ['bg-gray-200', 'bg-danger', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-success'];
  const labels = ['', 'Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {checks.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < score ? colors[score] : 'bg-gray-200 dark:bg-dark-border'}`}
          />
        ))}
      </div>
      {password.length > 0 && (
        <p className={`text-xs font-medium ${score >= 4 ? 'text-green-600' : score >= 3 ? 'text-yellow-600' : 'text-red-600'}`}>
          {labels[score]}
        </p>
      )}
      <div className="grid grid-cols-2 gap-1 text-xs">
        {checks.map(c => (
          <div key={c.label} className={`flex items-center gap-1 ${c.ok ? 'text-green-600' : 'text-gray-400'}`}>
            {c.ok ? <Check size={10} /> : <X size={10} />}
            {c.label}
          </div>
        ))}
      </div>
    </div>
  );
};

const RegisterPage = () => {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passValue, setPassValue] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', address: '', password: '', role: ROLES.USER },
  });

  const password = watch('password', '');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authRegister(data);
      toast.success(`Welcome to RateHub, ${res.user.name.split(' ')[0]}!`);
      if (res.user.role === ROLES.ADMIN) navigate('/admin');
      else if (res.user.role === ROLES.STORE_OWNER) navigate('/owner');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `input ${errors[field] ? 'ring-2 ring-danger/50 border-danger' : ''}`;

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
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
              <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text">Create your account</h1>
              <p className="text-sm text-gray-500 dark:text-dark-muted mt-1">Join RateHub for free</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Role */}
              <div>
                <label className="label">I am a</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: ROLES.USER, label: 'Shopper', icon: '🛒' },
                    { value: ROLES.STORE_OWNER, label: 'Store Owner', icon: '🏪' },
                  ].map(opt => (
                    <label key={opt.value} className="cursor-pointer">
                      <input {...register('role')} type="radio" value={opt.value} className="sr-only" />
                      <div className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all duration-150
                        ${watch('role') === opt.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                          : 'border-gray-200 dark:border-dark-border text-gray-600 dark:text-dark-muted hover:border-gray-300'
                        }`}>
                        <span>{opt.icon}</span>
                        <span className="text-sm font-medium">{opt.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="label">Full Name <span className="text-gray-400 text-xs">(20–60 chars)</span></label>
                <input {...register('name')} type="text" placeholder="Your full name" className={inputClass('name')} />
                {errors.name && <p className="text-xs text-danger mt-1">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="label">Email address</label>
                <input {...register('email')} type="email" placeholder="you@example.com" className={inputClass('email')} />
                {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
              </div>

              {/* Address */}
              <div>
                <label className="label">Address <span className="text-gray-400 text-xs">(max 400 chars)</span></label>
                <textarea
                  {...register('address')}
                  rows={2}
                  placeholder="Your address"
                  className={inputClass('address')}
                />
                {errors.address && <p className="text-xs text-danger mt-1">{errors.address.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    {...register('password', { onChange: e => setPassValue(e.target.value) })}
                    type={showPass ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    className={`${inputClass('password')} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <PasswordStrength password={password} />
                {errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full text-base mt-2">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus size={18} />
                    Create Account
                  </span>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-dark-muted mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700 transition-colors">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default RegisterPage;
