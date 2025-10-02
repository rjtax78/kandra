import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Card from '../components/Card';
import Loader from '../components/Loader';

export default function Entreprises() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    API.get('/entreprise').then(({data})=> setList(data)).catch(console.error).finally(()=>setLoading(false));
  }, []);

  if (loading) return <Loader/>;

  return (
    <div className="max-w-7xl mx-auto p-6 grid md:grid-cols-3 gap-6">
      {list.map(e => (
        <Card key={e.ID || e.id} title={e.EntrepriseNom || e.nom} subtitle={e.SecteurActivite || e.secteur}>
          <p>{e.Description || e.description}</p>
        </Card>
      ))}
    </div>
  );
}
