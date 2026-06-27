import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Star, ArrowRight, Shield, Zap, BarChart2, Users, Store, TrendingUp, ChevronDown } from 'lucide-react';
import { StarDisplay } from '../components/ui/RatingStars';
import PageTransition from '../components/ui/PageTransition';

const TYPED_WORDS = ['Discover Stores', 'Submit Reviews', 'Track Ratings', 'Drive Improvement'];

const TypedText = () => {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const full = TYPED_WORDS[idx];
    if (!deleting) {
      if (text.length < full.length) {
        timeoutRef.current = setTimeout(() => setText(full.slice(0, text.length + 1)), 80);
      } else {
        timeoutRef.current = setTimeout(() => setDeleting(true), 1800);
      }
    } else {
      if (text.length > 0) {
        timeoutRef.current = setTimeout(() => setText(text.slice(0, -1)), 45);
      } else {
        setDeleting(false);
        setIdx(i => (i + 1) % TYPED_WORDS.length);
      }
    }
    return () => clearTimeout(timeoutRef.current);
  }, [text, deleting, idx]);

  return (
    <span className="gradient-text">
      {text}
      <span className="animate-pulse">|</span>
    </span>
  );
};

const FadeInSection = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

const FEATURES = [
  { icon: Store, title: 'Store Discovery', desc: 'Browse thousands of local and online stores with rich details and real customer reviews.', color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20' },
  { icon: Star, title: 'Honest Ratings', desc: 'One rating per user ensures authentic, trustworthy feedback that stores can rely on.', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  { icon: BarChart2, title: 'Deep Analytics', desc: 'Store owners get powerful dashboards with trends, patterns, and actionable insights.', color: 'text-secondary-700', bg: 'bg-secondary-50 dark:bg-secondary-900/20' },
  { icon: Shield, title: 'Verified Reviews', desc: 'Role-based authentication ensures only real users can leave genuine store feedback.', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
  { icon: Zap, title: 'Instant Search', desc: 'Find any store in milliseconds with our real-time search and smart filtering system.', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  { icon: TrendingUp, title: 'Growth Tracking', desc: 'Watch your rating trend over time and understand what drives customer satisfaction.', color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-900/20' },
];

const STATS = [
  { value: '12K+', label: 'Active Users' },
  { value: '3.4K+', label: 'Stores Listed' },
  { value: '89K+', label: 'Reviews Given' },
  { value: '4.7★', label: 'Platform Rating' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Store Owner · MumbaiMart', text: 'RateHub transformed how we understand our customers. Our rating jumped from 3.2 to 4.6 in just three months using the analytics dashboard.', rating: 5 },
  { name: 'Arjun Mehta', role: 'Regular Shopper', text: 'I discovered my favorite bakery through RateHub. The reviews are genuine and I trust them completely when choosing where to shop.', rating: 5 },
  { name: 'Sneha Patel', role: 'Store Owner · TechZone', text: 'The analytics gave us clear insights into what customers want. We improved our service and the ratings followed.', rating: 4 },
];

const FAQS = [
  { q: 'Is RateHub free to use?', a: 'Yes! Discovering stores and submitting ratings is completely free. Store owners get a free dashboard with analytics included.' },
  { q: 'Can I edit my rating after submitting?', a: 'Absolutely. You can update your store rating at any time to reflect new experiences.' },
  { q: 'How do I get my store listed?', a: 'Register as a Store Owner and your store will be created and listed on the platform immediately.' },
  { q: 'Are reviews moderated?', a: 'Admins can review and manage all ratings. Our one-rating-per-user system prevents spam and manipulation.' },
];

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-secondary-500/10 dark:bg-secondary-500/5 rounded-full blur-3xl" />
        </div>

        <div className="text-center max-w-4xl mx-auto relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            Now in Public Beta · Join 12,000+ users
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-gray-900 dark:text-dark-text leading-tight mb-4 text-balance"
          >
            The smarter way to{' '}
            <br className="hidden sm:block" />
            <TypedText />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-500 dark:text-dark-muted max-w-2xl mx-auto mb-8"
          >
            RateHub connects shoppers with honest store reviews while giving business owners the insights they need to grow. Simple, trustworthy, and real-time.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link to="/register" className="btn btn-primary btn-lg text-base gap-2 shadow-glow hover:shadow-glow-lg">
              Start for Free
              <ArrowRight size={18} />
            </Link>
            <Link to="/stores" className="btn btn-outline btn-lg text-base">
              Browse Stores
            </Link>
          </motion.div>

          {/* Floating store cards */}
          <div className="relative mt-40 hidden md:block">
            {[
              { name: 'TechMart', rating: 4.8, reviews: 234, left: '0%' , bottom: '30%'},
              { name: 'BookNook', rating: 4.5, reviews: 89, left: '35%' ,bottom:'30%'},
              { name: 'FreshGrocer', rating: 4.2, reviews: 412, left: '70%' ,bottom:'30%'},
            ].map((s, i) => (
              <motion.div
  key={i}
  className="absolute card p-4 w-48 shadow-card-hover"
  style={{
    left: s.left,
    bottom: s.bottom,
    transform: "translateX(-50%)",
  }}
  initial={{ opacity: 0, y: 20 }}
  animate={{
    opacity: 1,
    y: [0, -10, 0], // Floating animation
  }}
  transition={{
    opacity: { duration: 0.5, delay: 0.7 + i * 0.15 },
    y: {
      duration: 3 + i * 0.5, // Different speed for each card
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  }}
  whileHover={{
    scale: 1.05,
    transition: { duration: 0.2 },
  }}
>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🏪</span>
                  <span className="font-semibold text-sm text-gray-900 dark:text-dark-text">{s.name}</span>
                </div>
                <StarDisplay rating={s.rating} size={13} />
                <p className="text-xs text-gray-500 dark:text-dark-muted mt-1">{s.reviews} reviews</p>
              </motion.div>
            ))}
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom--8  left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronDown size={24} className="text-gray-400" />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white dark:bg-dark-card border-y border-gray-100 dark:border-dark-border">
        <div className="page-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <FadeInSection key={s.label} delay={i * 0.1}>
                <div className="text-center">
                  <p className="text-3xl font-display font-bold gradient-text">{s.value}</p>
                  <p className="text-sm text-gray-500 dark:text-dark-muted mt-1">{s.label}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="page-container">
          <FadeInSection>
            <div className="text-center mb-14">
              <span className="badge badge-blue mb-3">Features</span>
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 dark:text-dark-text mb-4">
                Everything you need to rate and grow
              </h2>
              <p className="text-gray-500 dark:text-dark-muted max-w-xl mx-auto">
                A complete platform for shoppers, store owners, and administrators—all in one place.
              </p>
            </div>
          </FadeInSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <FadeInSection key={f.title} delay={i * 0.08}>
                <div className="card-hover p-6 group">
                  <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <f.icon size={22} className={f.color} />
                  </div>
                  <h3 className="font-display font-semibold text-gray-900 dark:text-dark-text mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-dark-muted leading-relaxed">{f.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-dark-card px-4">
        <div className="page-container">
          <FadeInSection>
            <div className="text-center mb-14">
              <span className="badge badge-green mb-3">Testimonials</span>
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-dark-text mb-4">
                Loved by users and store owners
              </h2>
            </div>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <FadeInSection key={t.name} delay={i * 0.1}>
                <div className="card p-6 flex flex-col gap-4">
                  <StarDisplay rating={t.rating} size={15} />
                  <p className="text-sm text-gray-600 dark:text-dark-muted leading-relaxed flex-1">"{t.text}"</p>
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-dark-text">{t.name}</p>
                    <p className="text-xs text-gray-400 dark:text-dark-muted">{t.role}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="page-container max-w-3xl">
          <FadeInSection>
            <div className="text-center mb-14">
              <span className="badge badge-purple mb-3">FAQ</span>
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-dark-text">
                Common questions
              </h2>
            </div>
          </FadeInSection>

          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <FadeInSection key={i} delay={i * 0.05}>
                <div className="card overflow-hidden">
                  <button
                    className="flex items-center justify-between w-full p-5 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-medium text-gray-900 dark:text-dark-text">{f.q}</span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={18} className="text-gray-400" />
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-gray-500 dark:text-dark-muted">{f.a}</p>
                  </motion.div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary-600 to-secondary-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-8 text-6xl animate-float">⭐</div>
          <div className="absolute bottom-8 right-12 text-5xl animate-float-reverse">🏪</div>
          <div className="absolute top-1/2 left-1/4 text-4xl animate-float-slow">🛒</div>
        </div>
        <div className="page-container text-center relative z-10">
          <FadeInSection>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
              Ready to discover great stores?
            </h2>
            <p className="text-primary-100 max-w-xl mx-auto mb-8">
              Join thousands of users and store owners building a better shopping experience together.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register" className="btn bg-white text-primary-700 hover:bg-primary-50 btn-lg font-semibold">
                Create Free Account
              </Link>
              <Link to="/stores" className="btn border-white/30 text-white hover:bg-white/10 btn-lg font-semibold border">
                Browse Stores
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-dark-card border-t border-gray-100 dark:border-dark-border py-10 px-4">
        <div className="page-container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-lg text-gray-900 dark:text-dark-text">
              Rate<span className="text-primary-600">Hub</span>
            </span>
            <span className="text-gray-400 text-sm">· Discover. Rate. Improve.</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500 dark:text-dark-muted">
            <Link to="/stores" className="hover:text-primary-600 transition-colors">Browse Stores</Link>
            <Link to="/login" className="hover:text-primary-600 transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-primary-600 transition-colors">Register</Link>
          </div>
          <p className="text-xs text-gray-400">© 2025 RateHub. All rights reserved.</p>
        </div>
      </footer>
    </PageTransition>
  );
};

export default LandingPage;
