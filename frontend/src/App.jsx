import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Opportunities from './pages/Opportunities';
import OpportunityDetail from './pages/OpportunityDetail';
import Entreprises from './pages/Entreprises';
import Candidatures from './pages/Candidatures';
import Profil from './pages/Profil';
import Ressources from './pages/Ressources';
import Statistiques from './pages/Statistiques';
import { setToken } from './services/api';

function Layout({ children }) {
  const location = useLocation();
  const hideNav = ['/login','/register'].includes(location.pathname);
  return (
    <>
      {!hideNav && <Navbar />}
      <main>{children}</main>
    </>
  );
}

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  useEffect(()=> {
    const t = localStorage.getItem('token');
    if (t) setToken(t);
  }, []);

  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
        <Route path="/opportunities" element={<PrivateRoute><Opportunities/></PrivateRoute>} />
        <Route path="/opportunite/:id" element={<PrivateRoute><OpportunityDetail/></PrivateRoute>} />
        <Route path="/entreprises" element={<PrivateRoute><Entreprises/></PrivateRoute>} />
        <Route path="/candidatures" element={<PrivateRoute><Candidatures/></PrivateRoute>} />
        <Route path="/profil" element={<PrivateRoute><Profil/></PrivateRoute>} />
        <Route path="/ressources" element={<PrivateRoute><Ressources/></PrivateRoute>} />
        <Route path="/statistiques" element={<PrivateRoute><Statistiques/></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Layout>
  );
}
