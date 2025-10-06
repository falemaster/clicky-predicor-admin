import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import AdminAnalysis from "./pages/AdminAnalysis";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminUsers from "./pages/AdminUsers";
import AdminCompanies from "./pages/AdminCompanies";
import AdminEditor from "./pages/AdminEditor";
import Analysis from "./pages/Analysis";
import AnalysisMockupReference from "./pages/AnalysisMockupReference";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "./components/admin/AdminLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected Admin Routes with Layout */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="companies" element={<AdminCompanies />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="editor" element={<AdminEditor />} />
              <Route path="editor/:siren" element={<AdminEditor />} />
              <Route path="settings" element={<div className="p-6">Configuration - À venir</div>} />
            </Route>
            
            {/* Legacy Admin Routes (also protected) */}
            <Route path="/admin-old" element={
              <ProtectedRoute requireAdmin>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/admin-analysis" element={
              <ProtectedRoute requireAdmin>
                <AdminAnalysis />
              </ProtectedRoute>
            } />
            
            {/* Public Routes */}
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/analysis-mockup" element={<AnalysisMockupReference />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
