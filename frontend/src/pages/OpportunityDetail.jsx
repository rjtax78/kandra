import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

export default function OpportunityDetail() {
  const { id } = useParams();
  const [opp, setOpp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/opportunite/${id}`)
      .then(({ data }) => setOpp(data))
      .catch(console.error)
      .finally(()=>setLoading(false));
  }, [id]);

  const postuler = async () => {
    try {
      await API.post('/candidature', { OpportuniteID: id });
      toast.success('Candidature envoyée');
    } catch {
      toast.error('Erreur candidature');
    }
  };

  if (loading) return <Loader />;
  if (!opp) return <p>Introuvable</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{opp.Titre || opp.titre}</h1>
      <div className="text-sm text-gray-500 mb-4">{opp.EntrepriseNom || opp.entreprise_nom}</div>
      <p className="mb-6">{opp.Description || opp.description}</p>
      <button onClick={postuler} className="bg-green-600 text-white px-4 py-2 rounded">Postuler</button>
    </div>
  );
}
