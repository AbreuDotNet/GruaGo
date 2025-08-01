import { useState, useEffect } from 'react'
import './App.css'

interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  is_active: boolean;
}

interface TowRequest {
  id: number;
  user_id: number;
  status: string;
  pickup_location: string;
  destination: string;
  created_at: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [towRequests, setTowRequests] = useState<TowRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, requestsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/tow-requests')
      ]);
      
      const usersData = await usersRes.json();
      const requestsData = await requestsRes.json();
      
      setUsers(usersData.data || []);
      setTowRequests(requestsData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando datos...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🚚 GruaGo Dashboard</h1>
        <p>Sistema de gestión de servicios de grúa</p>
      </header>

      <div className="dashboard-grid">
        <div className="card">
          <h2>👥 Usuarios Activos</h2>
          <div className="stat-number">{users.length}</div>
          <div className="user-list">
            {users.slice(0, 5).map(user => (
              <div key={user.id} className="user-item">
                <span>{user.full_name}</span>
                <span className={`status ${user.is_active ? 'active' : 'inactive'}`}>
                  {user.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>🚨 Solicitudes de Grúa</h2>
          <div className="stat-number">{towRequests.length}</div>
          <div className="request-list">
            {towRequests.slice(0, 5).map(request => (
              <div key={request.id} className="request-item">
                <span>#{request.id}</span>
                <span className={`status status-${request.status?.toLowerCase()}`}>
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
