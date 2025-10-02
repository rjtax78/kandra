import React, { useState } from 'react';
import API from '../services/api';
import FormInput from '../components/FormInput';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Register() {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motdepasse, setMotdepasse] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', { Email: email, MotDePasse: motdepasse, Nom: nom });
      toast.success('Compte créé — connecte-toi');
      navigate('/login');
    } catch {
      toast.error('Échec inscription');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Inscription</h2>
        <form onSubmit={submit}>
          <FormInput label="Nom" value={nom} onChange={(e)=>setNom(e.target.value)} />
          <FormInput label="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <FormInput label="Mot de passe" type="password" value={motdepasse} onChange={(e)=>setMotdepasse(e.target.value)} />
          <button className="w-full bg-green-600 text-white py-2 rounded">S'inscrire</button>
        </form>
      </div>
    </div>
  );
}
