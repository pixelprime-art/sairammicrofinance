import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout Wrappers
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';

// Public/Customer Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Loans } from './pages/Loans';
import { CalculatorPage } from './pages/CalculatorPage';
import { ApplyLoan } from './pages/ApplyLoan';
import { Contact } from './pages/Contact';

// Legal/Additional Pages
import { PrivacyPolicy } from './pages/Legal/PrivacyPolicy';
import { TermsAndConditions } from './pages/Legal/TermsAndConditions';
import { Disclaimer } from './pages/Legal/Disclaimer';
import { TestimonialsPage } from './pages/Legal/TestimonialsPage';

// Admin Pages
import { Dashboard as AdminDashboard } from './pages/Admin/Dashboard';
import { Applications as AdminApplications } from './pages/Admin/Applications';
import { Customers as AdminCustomers } from './pages/Admin/Customers';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Customer Routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/loans" element={<Layout><Loans /></Layout>} />
          <Route path="/calculator" element={<Layout><CalculatorPage /></Layout>} />
          <Route path="/apply" element={<Layout><ApplyLoan /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          
          {/* Legal and Additional Routes */}
          <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
          <Route path="/terms" element={<Layout><TermsAndConditions /></Layout>} />
          <Route path="/disclaimer" element={<Layout><Disclaimer /></Layout>} />
          <Route path="/testimonials" element={<Layout><TestimonialsPage /></Layout>} />

          {/* Admin Back-Office Protected Routes */}
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/applications" element={<AdminLayout><AdminApplications /></AdminLayout>} />
          <Route path="/admin/customers" element={<AdminLayout><AdminCustomers /></AdminLayout>} />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
