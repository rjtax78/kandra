import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SignedIn } from "@clerk/clerk-react";
import { AuthProvider } from "./contexts/AuthContext";
import AuthWrapper from "./components/auth/AuthWrapper";
import Navbar from "./components/common/Navbar";
import JwtNavbar from "./components/common/JwtNavbar";
import Home from "./pages/Home";
import ClerkLogin from "./pages/ClerkLogin";
import ClerkRegister from "./pages/ClerkRegister";
import CustomRegister from "./pages/CustomRegister";
import CustomLogin from "./pages/CustomLogin";
import TestBackend from "./pages/TestBackend";
import RedirectionTest from "./pages/RedirectionTest";
import CompanyDashboardAPITest from "./pages/CompanyDashboardAPITest";
import Dashboard from "./pages/Dashboard";
import Opportunities from "./pages/Opportunities";
import OpportunityDetail from "./pages/OpportunityDetail";
import Entreprises from "./pages/Entreprises";
import Candidatures from "./pages/Candidatures";
import Profil from "./pages/Profil";
import Ressources from "./pages/Ressources";
import Statistiques from "./pages/Statistiques";
// New etudiant pages
import OffresListe from "./pages/etudiant/OffresListe";
import DokartiHomepage from "./pages/DokartiHomepage";
// Student specific pages
import MyApplications from "./pages/student/MyApplications";
import Profile from "./pages/student/Profile";
// Role-based components
import RoleProtectedRoute from "./components/auth/RoleProtectedRoute";
// Role-specific dashboards
import AdminDashboard from "./pages/admin/AdminDashboard";
import RoleSelection from "./pages/RoleSelection";
import SetupInstructions from "./pages/SetupInstructions";
import ComprehensiveRoleSelection from "./pages/ComprehensiveRoleSelection";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import PostJob from "./pages/company/PostJob";
import Applications from "./pages/company/Applications";

function Layout({ children }) {
  const location = useLocation();
  const hideNav = [
    "/login",
    "/register",
    "/sign-in",
    "/sign-up",
    "/",
    "/select-role",
    "/setup-instructions",
    "/comprehensive-role-selection",
  ].includes(location.pathname);
  return (
    <>
      {!hideNav && <JwtNavbar />}
      <main className={hideNav ? "" : "pt-0"}>{children}</main>
    </>
  );
}

function ProtectedRoute({ children }) {
  return <SignedIn>{children}</SignedIn>;
}

export default function App() {
  return (
    <AuthProvider>
      <AuthWrapper>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<CustomLogin />} />
            <Route path="/register" element={<CustomRegister />} />
            <Route path="/sign-in" element={<CustomLogin />} />
            <Route path="/sign-up" element={<CustomRegister />} />

            {/* Role Selection */}
            <Route path="/select-role" element={<RoleSelection />} />
            <Route
              path="/comprehensive-role-selection"
              element={<ComprehensiveRoleSelection />}
            />
            <Route path="/setup-instructions" element={<SetupInstructions />} />

            {/* Test Backend Route */}
            <Route path="/test-backend" element={<TestBackend />} />
            <Route path="/test-redirect" element={<RedirectionTest />} />
            <Route path="/test-company-api" element={<CompanyDashboardAPITest />} />

            {/* Student Routes */}
            <Route
              path="/dokarti"
              element={
                <RoleProtectedRoute
                  allowedRoles={["student"]}
                  fallbackRoute="/login"
                >
                  <DokartiHomepage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/etudiant/offres"
              element={
                <RoleProtectedRoute
                  allowedRoles={["student"]}
                  fallbackRoute="/login"
                >
                  <OffresListe />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/student/dashboard"
              element={
                <RoleProtectedRoute
                  allowedRoles={["student"]}
                  fallbackRoute="/login"
                >
                  <DokartiHomepage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/student/applications"
              element={
                <RoleProtectedRoute
                  allowedRoles={["student"]}
                  fallbackRoute="/login"
                >
                  <MyApplications />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <RoleProtectedRoute
                  allowedRoles={["student"]}
                  fallbackRoute="/login"
                >
                  <Profile />
                </RoleProtectedRoute>
              }
            />

            {/* Company Routes */}
            <Route
              path="/company/dashboard"
              element={
                <RoleProtectedRoute
                  allowedRoles={["company"]}
                  fallbackRoute="/login"
                >
                  <CompanyDashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/company/post-job"
              element={
                <RoleProtectedRoute
                  allowedRoles={["company"]}
                  fallbackRoute="/login"
                >
                  <PostJob />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/company/applications"
              element={
                <RoleProtectedRoute
                  allowedRoles={["company"]}
                  fallbackRoute="/login"
                >
                  <Applications />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/company/applications/:jobId"
              element={
                <RoleProtectedRoute
                  allowedRoles={["company"]}
                  fallbackRoute="/login"
                >
                  <Applications />
                </RoleProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <RoleProtectedRoute
                  allowedRoles={["admin"]}
                  fallbackRoute="/login"
                >
                  <AdminDashboard />
                </RoleProtectedRoute>
              }
            />

            {/* Legacy Protected Routes (accessible by all authenticated users) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/opportunities"
              element={
                <ProtectedRoute>
                  <Opportunities />
                </ProtectedRoute>
              }
            />
            <Route
              path="/opportunite/:id"
              element={
                <ProtectedRoute>
                  <OpportunityDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/entreprises"
              element={
                <ProtectedRoute>
                  <Entreprises />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidatures"
              element={
                <ProtectedRoute>
                  <Candidatures />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profil"
              element={
                <ProtectedRoute>
                  <Profil />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ressources"
              element={
                <ProtectedRoute>
                  <Ressources />
                </ProtectedRoute>
              }
            />
            <Route
              path="/statistiques"
              element={
                <ProtectedRoute>
                  <Statistiques />
                </ProtectedRoute>
              }
            />
            {/* Redirect to home for unknown routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </AuthWrapper>
    </AuthProvider>
  );
}
