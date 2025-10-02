import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Loader from '../components/Loader';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#2563eb','#16a34a','#f59e0b','#ef4444','#9333ea'];

export default function Statistiques() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    API.get('/statistique').then(({data})=> setStats(data)).catch(console.error).finally(()=>setLoading(false));
  }, []);

  if (loading) return <Loader/>;
  if (!stats) return <div className="p-6">Aucune donnée</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Statistiques</h1>

      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-2">Opportunités par entreprise</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={stats.opportunites_par_entreprise || []}>
              <XAxis dataKey="entreprise" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-2">Candidatures par statut</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={stats.candidatures_par_status || []} dataKey="count" nameKey="status" outerRadius={100} label>
                {(stats.candidatures_par_status || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
