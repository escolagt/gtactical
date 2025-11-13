import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

// Admin
import Dashboard from "./admin/pages/Dashboard";
import Leads from "./admin/pages/Leads";
import Courses from "./admin/pages/Courses";
import Settings from "./admin/pages/Settings";
import AdminLogin from "./admin/pages/Login";
import AdminLayout from "./admin/components/AdminLayout";
import RequireAdmin from "./admin/components/RequireAdmin";

// Público extra
import ResetPassword from "./pages/ResetPassword";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Público */}
          <Route path="/" element={<Landing />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Páginas legais públicas */}
          <Route path="/termos-de-uso" element={<TermsPage />} />
          <Route path="/politica-de-privacidade" element={<PrivacyPage />} />

          {/* Área Admin (protegida) */}
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="leads" element={<Leads />} />
            <Route path="courses" element={<Courses />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch-all */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
