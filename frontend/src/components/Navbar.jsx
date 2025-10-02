import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const nav = useNavigate();
  const token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    nav('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">LinkedIn-Clone</Link>
        <nav className="flex items-center gap-4">
          {token ? (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Accueil</Link>
              <Link to="/opportunities" className="text-gray-700 hover:text-blue-600">Opportunités</Link>
              <Link to="/entreprises" className="text-gray-700 hover:text-blue-600">Entreprises</Link>
              <Link to="/candidatures" className="text-gray-700 hover:text-blue-600">Candidatures</Link>
              <button onClick={logout} className="ml-2 bg-red-600 text-white px-3 py-1 rounded">Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600">Connexion</Link>
              <Link to="/register" className="text-white bg-green-600 px-3 py-1 rounded hover:bg-green-700">Inscription</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
