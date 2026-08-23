import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/Toast';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

import { LandingPage } from './pages/LandingPage';

// Customer
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { CreateOrderPage } from './pages/customer/CreateOrderPage';
import { OrderListPage } from './pages/customer/OrderListPage';
import { OrderDetailPage } from './pages/customer/OrderDetailPage';
import { ReschedulePage } from './pages/customer/ReschedulePage';

// Agent
import { AgentDashboard } from './pages/agent/AgentDashboard';
import { AgentOrdersPage } from './pages/agent/AgentOrdersPage';
import { AgentOrderDetailPage } from './pages/agent/AgentOrderDetailPage';

// Admin
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminOrderDetailPage } from './pages/admin/AdminOrderDetailPage';
import { ZoneManagementPage } from './pages/admin/ZoneManagementPage';
import { AreaManagementPage } from './pages/admin/AreaManagementPage';
import { RateCardManagementPage } from './pages/admin/RateCardManagementPage';
import { CodConfigPage } from './pages/admin/CodConfigPage';
import { AgentManagementPage } from './pages/admin/AgentManagementPage';
import { CustomerManagementPage } from './pages/admin/CustomerManagementPage';
import { NotificationLogPage } from './pages/admin/NotificationLogPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const NotFound = () => <div className="flex flex-col items-center justify-center min-h-[60vh]"><h1 className="text-4xl font-bold text-surface-900 mb-2">404</h1><p className="text-surface-500">Page not found</p></div>;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected App Routes */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              } />
              
              {/* Customer Routes */}
              <Route path="dashboard" element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <CustomerDashboard />
                </ProtectedRoute>
              } />
              <Route path="orders/new" element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <CreateOrderPage />
                </ProtectedRoute>
              } />
              <Route path="orders" element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <OrderListPage />
                </ProtectedRoute>
              } />
              <Route path="orders/:id" element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <OrderDetailPage />
                </ProtectedRoute>
              } />
              <Route path="orders/:id/reschedule" element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <ReschedulePage />
                </ProtectedRoute>
              } />

              {/* Agent Routes */}
              <Route path="agent" element={
                <ProtectedRoute allowedRoles={['AGENT']}>
                  <AgentDashboard />
                </ProtectedRoute>
              } />
              <Route path="agent/orders" element={
                <ProtectedRoute allowedRoles={['AGENT']}>
                  <AgentOrdersPage />
                </ProtectedRoute>
              } />
              <Route path="agent/orders/:id" element={
                <ProtectedRoute allowedRoles={['AGENT']}>
                  <AgentOrderDetailPage />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="admin" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="admin/orders" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminOrdersPage />
                </ProtectedRoute>
              } />
              <Route path="admin/orders/:id" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminOrderDetailPage />
                </ProtectedRoute>
              } />
              <Route path="admin/zones" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ZoneManagementPage />
                </ProtectedRoute>
              } />
              <Route path="admin/areas" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AreaManagementPage />
                </ProtectedRoute>
              } />
              <Route path="admin/rate-cards" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <RateCardManagementPage />
                </ProtectedRoute>
              } />
              <Route path="admin/cod-configs" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <CodConfigPage />
                </ProtectedRoute>
              } />
              <Route path="admin/agents" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AgentManagementPage />
                </ProtectedRoute>
              } />
              <Route path="admin/customers" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <CustomerManagementPage />
                </ProtectedRoute>
              } />
              <Route path="admin/notifications" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <NotificationLogPage />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
