import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-64 p-4 bg-white rounded shadow h-full">
      <div className="mb-4 font-semibold">Menu</div>
      <ul className="space-y-2 text-sm">
        <li><Link to="/dashboard" className="block px-2 py-1 rounded hover:bg-gray-100">Dashboard</Link></li>
        <li><Link to="/opportunities" className="block px-2 py-1 rounded hover:bg-gray-100">Opportunités</Link></li>
        <li><Link to="/entreprises" className="block px-2 py-1 rounded hover:bg-gray-100">Entreprises</Link></li>
        <li><Link to="/candidatures" className="block px-2 py-1 rounded hover:bg-gray-100">Candidatures</Link></li>
        <li><Link to="/profil" className="block px-2 py-1 rounded hover:bg-gray-100">Profil</Link></li>
        <li><Link to="/ressources" className="block px-2 py-1 rounded hover:bg-gray-100">Ressources</Link></li>
        <li><Link to="/statistiques" className="block px-2 py-1 rounded hover:bg-gray-100">Statistiques</Link></li>
      </ul>
    </aside>
  );
}
