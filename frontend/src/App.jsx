import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import { ROLES } from './utils/helpers';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// UI
import CustomCursor from './components/ui/CustomCursor';

// Pages - Public
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NotFound from './pages/NotFound';
import StoresPage from './pages/user/StoresPage';
import StoreDetail from './pages/user/StoreDetail';

// Pages - Shared
import ProfilePage from './pages/ProfilePage';

// Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStores from './pages/admin/AdminStores';
import AdminRatings from './pages/admin/AdminRatings';

// Pages - User
import UserDashboard from './pages/user/UserDashboard';
import MyRatings from './pages/user/MyRatings';
import Favorites from './pages/user/Favorites';

// Pages - Owner
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerStore from './pages/owner/OwnerStore';
import OwnerReviews from './pages/owner/OwnerReviews';
import OwnerAnalytics from './pages/owner/OwnerAnalytics';

const App = () => {
  const { user } = useAuth();

  return (
    <>
      <CustomCursor />
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/stores/:id" element={<StoreDetail />} />
        </Route>

        {/* Admin routes */}
        <Route
          element={
            <ProtectedRoute roles={[ROLES.ADMIN]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/stores" element={<AdminStores />} />
          <Route path="/admin/ratings" element={<AdminRatings />} />
        </Route>

        {/* Store Owner routes */}
        <Route
          element={
            <ProtectedRoute roles={[ROLES.STORE_OWNER]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/owner" element={<OwnerDashboard />} />
          <Route path="/owner/store" element={<OwnerStore />} />
          <Route path="/owner/reviews" element={<OwnerReviews />} />
          <Route path="/owner/analytics" element={<OwnerAnalytics />} />
        </Route>

        {/* User routes */}
        <Route
          element={
            <ProtectedRoute roles={[ROLES.USER]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/my-ratings" element={<MyRatings />} />
          <Route path="/favorites" element={<Favorites />} />
        </Route>

        {/* Shared protected */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={
          <PublicLayout>
            <NotFound />
          </PublicLayout>
        } />
      </Routes>
    </>
  );
};

export default App;
