import { useState, Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { PaymentProvider } from './contexts/PaymentContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer } from './components/ToastContainer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { NavBar } from './components/layout/NavBar';
import { Footer } from './components/layout/Footer';
import { ComponentShowcase } from './components/ComponentShowcase';
import { Loading } from './components/ui/Loading';
import { initializeAnalytics, trackPageView } from './analytics';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Code-split heavy pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Export = lazy(() => import('./pages/Export'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Pricing = lazy(() => import('./pages/Pricing'));

function AppRoutes() {
  const location = useLocation();

  // Track page views for analytics
  useEffect(() => {
    trackPageView(location.pathname, document.title);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <Suspense fallback={<Loading />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/components" element={<ComponentShowcase />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/project/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
            <Route path="/export" element={<ProtectedRoute><Export /></ProtectedRoute>} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));

  // Initialize analytics on mount
  useEffect(() => {
    const measurementId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
    if (measurementId) {
      initializeAnalytics(measurementId);
    }
  }, []);

  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <PaymentProvider>
            <div className={theme === 'dark' ? 'dark' : 'light'}>
              <div className="min-h-screen bg-midnight text-white transition-colors duration-500 dark:bg-slate-50 dark:text-slate-950">
                <BrowserRouter>
                  <NavBar theme={theme} onToggleTheme={toggleTheme} />
                  <AppRoutes />
                  <Footer />
                </BrowserRouter>
                <ToastContainer />
              </div>
            </div>
          </PaymentProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
