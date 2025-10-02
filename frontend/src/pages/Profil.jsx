import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Loader from '../components/Loader';

export default function Profil() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    API.get('/candidat/me')
      .then(({data})=> setUser(data))
      .catch(()=> setUser(null))
      .finally(()=> setLoading(false));
  }, []);

  if (loading) return <Loader/>;
  if (!user) return <div className="p-6">Aucun profil</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{user.Nom || user.nom}</h1>
      <p>Email: {user.Email || user.email}</p>
      <p>Telephone: {user.TelephoneContact || user.telephone}</p>
      <p>Formation: {user.NiveauEtude || user.niveau}</p>
      {user.CVID && <a href={`http://localhost:5000/uploads/${user.CVID}`} target="_blank" rel="noreferrer" className="text-blue-600 underline">Voir CV</a>}
    </div>
  );
}
