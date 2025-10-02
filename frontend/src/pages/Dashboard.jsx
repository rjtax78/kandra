import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Alerts from '../components/Alerts';
import API from '../services/api';
import Loader from '../components/Loader';

export default function Dashboard() {
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/opportunite')
      .then(({ data }) => setLatest(data.slice(0,6)))
      .catch(console.error)
      .finally(()=>setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Alerts/>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Sidebar />
        </div>
        <div className="lg:col-span-3 space-y-4">
          <Card title="Bienvenue">
            <p>Bienvenue sur ton espace — consulte les dernières opportunités et tes candidatures.</p>
          </Card>

          <Card title="Dernières opportunités">
            {loading ? <Loader/> : (
              <div className="grid md:grid-cols-2 gap-4">
                {latest.map(o => (
                  <div key={o.ID || o.id} className="p-3 border rounded">
                    <div className="font-semibold">{o.Titre || o.titre}</div>
                    <div className="text-sm text-gray-500">{o.EntrepriseNom || o.entreprise_nom}</div>
                    <p className="mt-2 text-sm">{(o.Description || o.description || '').slice(0,150)}...</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
