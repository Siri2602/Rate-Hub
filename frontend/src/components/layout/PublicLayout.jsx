import { Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import StoreBackground from '../ui/StoreBackground';

const PublicLayout = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-dark-bg relative overflow-hidden">
    <StoreBackground />
    <Navbar />
    <main className="pt-14 relative z-10">
      <AnimatePresence mode="wait">
        <Outlet />
      </AnimatePresence>
    </main>
  </div>
);

export default PublicLayout;
