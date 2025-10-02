import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Card from '../components/Card';
import Loader from '../components/Loader';

export default function Candidatures() {
  const [cands, setCands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    API.get('/candidature/me').then(({data})=> setCands(data)).catch(console.error).finally(()=>setLoading(false));
  }, []);

  if (loading) return <Loader/>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-4">
      {cands.map(c => (
        <Card key={c.ID || c.id} title={c.opportunite_titre || c.Titre}>
          <div className="text-sm text-gray-600">Entreprise: {c.entreprise_nom || c.EntrepriseNom}</div>
          <div className="mt-2">Statut: <span className={`px-2 py-1 rounded ${c.Statut==="acceptee" || c.statut==="acceptee" ? 'bg-green-100 text-green-700' : c.Statut==="refusee" || c.statut==="refusee" ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-800'}`}>{c.Statut || c.statut}</span></div>
        </Card>
      ))}
    </div>
  );
}
