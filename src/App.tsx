import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider } from './store';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ReportPage from './pages/ReportPage';
import DashboardPage from './pages/DashboardPage';
import MapPage from './pages/MapPage';
import IssueDetailPage from './pages/IssueDetailPage';
import AnalyticsPage from './pages/AnalyticsPage';
import RewardsPage from './pages/RewardsPage';
import ImpactPage from './pages/ImpactPage';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        style={{ flex: 1 }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/issue/:id" element={<IssueDetailPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/impact" element={<ImpactPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Navbar />
      <AnimatedRoutes />
      <Chatbot />
    </AppProvider>
  );
}
