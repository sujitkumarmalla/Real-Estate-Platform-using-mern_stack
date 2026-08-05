import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/shared/LandingPage';
import Login from './pages/shared/Login';
import Register from './pages/shared/Register';
import Profile from './pages/shared/Profile';
import Properties from './pages/shared/Properties';
import PropertyDetails from './pages/shared/PropertyDetails';
import VerifyEmail from './pages/shared/VerifyEmail';
import ForgotPassword from './pages/shared/ForgotPassword';
import ResetPassword from './pages/shared/ResetPassword';
import Chat from './pages/shared/Chat';
import Upgrade from './pages/shared/Upgrade';
import InfoPage from './pages/shared/InfoPage';

// Buyer
import BuyerDashboard from './pages/buyer/BuyerDashboard';

// Seller
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProperties from './pages/seller/SellerProperties';
import AddProperty from './pages/seller/AddProperty';
import SellerInquiries from './pages/seller/SellerInquiries';
import EditProperty from './pages/seller/EditProperty';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUserManagement from './pages/admin/AdminUserManagement';
import AdminPropertyManagement from './pages/admin/AdminPropertyManagement';
import AdminInquiryManagement from './pages/admin/AdminInquiryManagement';
import AdminSellerRequests from './pages/admin/AdminSellerRequests';
import AdminChatManagement from './pages/admin/AdminChatManagement';

import ProtectedRoute from './components/ProtectedRoute';
import AICalculatorBot from './components/common/AICalculatorBot';

function App() {
  return (
    <>
      <Routes>
      {/* Shared Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route element={<ProtectedRoute allowedRoles={['buyer', 'seller']} />}>
        <Route path="/chat" element={<Chat />} />
      </Route>
      <Route path="/properties" element={<Properties />} />
      <Route path="/property/:id" element={<PropertyDetails />} />
      <Route path="/about" element={<InfoPage />} />
      <Route path="/faq" element={<InfoPage />} />
      <Route path="/privacy" element={<InfoPage />} />
      <Route path="/terms" element={<InfoPage />} />
      <Route path="/contact" element={<InfoPage />} />

      {/* Buyer Routes */}
      <Route element={<ProtectedRoute allowedRoles={['buyer', 'seller', 'admin']} />}>
        <Route path="/dashboard" element={<BuyerDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/upgrade" element={<Upgrade />} />
      </Route>

      {/* Seller Routes */}
      <Route element={<ProtectedRoute allowedRoles={['seller']} />}>
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/seller/properties" element={<SellerProperties />} />
        <Route path="/seller/edit-property/:id" element={<EditProperty />} />
        <Route path="/seller/add-property" element={<AddProperty />} />
        <Route path="/seller/inquiries" element={<SellerInquiries />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUserManagement />} />
        <Route path="/admin/properties" element={<AdminPropertyManagement />} />
        <Route path="/admin/inquiries" element={<AdminInquiryManagement />} />
        <Route path="/admin/seller-requests" element={<AdminSellerRequests />} />
        <Route path="/admin/chats" element={<AdminChatManagement />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<div>404 - Not Found</div>} />
    </Routes>
    <AICalculatorBot />
    </>
  );
}

export default App;