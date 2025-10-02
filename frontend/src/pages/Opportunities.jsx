import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

export default function Opportunities() {
  const [ops, setOps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/opportunite')
      .then(({ data }) => setOps(data))
      .catch(console.error)
      .finally(()=>setLoading(false));
  }, []);

  if (loading) return <Loader/>;

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {ops.map(o => (
        <Card key={o.ID || o.id} title={o.Titre || o.titre} subtitle={o.EntrepriseNom || o.entreprise_nom}>
          <p className="text-sm mb-3">{(o.Description || o.description || '').slice(0,120)}...</p>
          <div className="flex justify-between items-center">
            <Link to={`/opportunite/${o.ID || o.id}`} className="text-blue-600">Voir</Link>
            <span className="text-xs text-gray-500">{o.DatePublication || o.date_publication}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
