import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    let mounted = true;
    API.get('/alerte/me').then(({ data }) => {
      if (mounted) setAlerts(data || []);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  if (!alerts.length) return null;

  return (
    <div className="space-y-2">
      {alerts.map(a => (
        <div key={a.ID || a.id} className="p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded">
          {a.Contenu || a.message || a.contenu}
        </div>
      ))}
    </div>
  );
}
