import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-md"
    >
      <div className="text-8xl mb-6 animate-float">🔍</div>
      <h1 className="text-6xl font-display font-bold gradient-text mb-4">404</h1>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text mb-2">Page Not Found</h2>
      <p className="text-gray-500 dark:text-dark-muted mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={() => window.history.back()} className="btn btn-outline btn-lg gap-2">
          <ArrowLeft size={18} />
          Go Back
        </button>
        <Link to="/" className="btn btn-primary btn-lg gap-2">
          <Home size={18} />
          Home
        </Link>
      </div>
    </motion.div>
  </div>
);

export default NotFound;
