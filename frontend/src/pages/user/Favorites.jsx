import { Link } from 'react-router-dom';
import PageTransition from '../../components/ui/PageTransition';
import EmptyState from '../../components/ui/EmptyState';

const Favorites = () => (
  <PageTransition>
    <div className="mb-6">
      <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text">Favorites</h1>
      <p className="text-sm text-gray-500 dark:text-dark-muted mt-0.5">Stores you've bookmarked</p>
    </div>
    <EmptyState
      icon="❤️"
      title="No Favorites Yet"
      description="Rate stores to start building your favorites list."
      action={<Link to="/stores" className="btn btn-primary btn-md">Browse Stores</Link>}
    />
  </PageTransition>
);

export default Favorites;
