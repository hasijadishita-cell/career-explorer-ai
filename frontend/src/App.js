import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AssessmentProvider } from "@/context/AssessmentContext";
import { AuthProvider } from "@/context/AuthContext";
import LandingPage from "@/pages/LandingPage";
import AssessmentPage from "@/pages/AssessmentPage";
import RatingPage from "@/pages/RatingPage";
import ResultsPage from "@/pages/ResultsPage";
import { LoginPage, SignupPage, ForgotPasswordPage } from "@/pages/AuthPages";
import DashboardPage from "@/pages/DashboardPage";
import AdminPage from "@/pages/AdminPage";
import CareerDetailPage from "@/pages/CareerDetailPage";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <AssessmentProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/assessment" element={<AssessmentPage />} />
              <Route path="/rate" element={<RatingPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/career/:slug" element={<CareerDetailPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          <Toaster position="top-center" richColors closeButton />
        </AssessmentProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
