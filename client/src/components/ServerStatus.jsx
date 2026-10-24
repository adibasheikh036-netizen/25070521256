import { useEffect, useState } from 'react';

const LABELS = {
  checking: 'Checking server…',
  online: 'Server online · MongoDB connected',
  'db-offline': 'Server online · MongoDB is offline',
  offline: 'Server offline · run start.bat',
};

// Small pill under the form that shows whether the API and MongoDB are reachable
export default function ServerStatus() {
  const [state, setState] = useState('checking');

  useEffect(() => {
    let alive = true;

    async function check() {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        if (alive) setState(data.status === 'ok' ? 'online' : 'db-offline');
      } catch {
        if (alive) setState('offline');
      }
    }

    check();
    const timer = setInterval(check, 10000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={`server-status is-${state}`}>
      <span className="server-dot" />
      {LABELS[state]}
    </div>
  );
}
