import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './Dashboard.css';

interface DashboardStats {
  users: number;
  drivers: number;
  vehicles: number;
  services: number;
  towRequests: number;
  tenants: number;
}

interface RecentRequest {
  id: number;
  origin_address: string;
  destination_address: string;
  status: string;
  total_price: number;
  requested_at: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    users: 0,
    drivers: 0,
    vehicles: 0,
    services: 0,
    towRequests: 0,
    tenants: 0,
  });
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'Usuarios', icon: '👥' },
    { id: 'drivers', label: 'Conductores', icon: '🚛' },
    { id: 'vehicles', label: 'Vehículos', icon: '🚗' },
    { id: 'services', label: 'Servicios', icon: '⚙️' },
    { id: 'requests', label: 'Solicitudes', icon: '📋' },
    { id: 'tenants', label: 'Empresas', icon: '🏢' },
    { id: 'reports', label: 'Reportes', icon: '📈' },
    { id: 'settings', label: 'Configuración', icon: '⚙️' },
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Load stats from all endpoints
      const [
        usersRes,
        driversRes,
        vehiclesRes,
        servicesRes,
        towRequestsRes,
        tenantsRes,
      ] = await Promise.all([
        axios.get('/users'),
        axios.get('/drivers'),
        axios.get('/vehicles'),
        axios.get('/services'),
        axios.get('/tow-requests'),
        axios.get('/tenants'),
      ]);

      setStats({
        users: usersRes.data.length,
        drivers: driversRes.data.length,
        vehicles: vehiclesRes.data.length,
        services: servicesRes.data.length,
        towRequests: towRequestsRes.data.length,
        tenants: tenantsRes.data.length,
      });

      // Get recent requests (last 5)
      const sortedRequests = towRequestsRes.data
        .sort((a: RecentRequest, b: RecentRequest) => 
          new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime()
        )
        .slice(0, 5);
      
      setRecentRequests(sortedRequests);

    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      setError('Error al cargar los datos del dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'status-pending',
      assigned: 'status-assigned',
      in_progress: 'status-progress',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
    };

    const statusLabels = {
      pending: 'Pendiente',
      assigned: 'Asignado',
      in_progress: 'En Progreso',
      completed: 'Completado',
      cancelled: 'Cancelado',
    };

    return (
      <span className={`status-badge ${statusClasses[status as keyof typeof statusClasses] || 'status-pending'}`}>
        {statusLabels[status as keyof typeof statusLabels] || status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="app-logo">
            <span className="logo-icon">🚛</span>
            <span className="logo-text">GruaGo</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeMenuItem === item.id ? 'active' : ''}`}
              onClick={() => setActiveMenuItem(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Layout */}
      <div className="dashboard-main-layout">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <h1>Dashboard</h1>
              <p>Bienvenido, <strong>{user?.full_name}</strong></p>
            </div>
            <div className="header-right">
              <div className="user-info">
                <span className="user-name">{user?.full_name}</span>
                <span className="user-tenant">{user?.tenant_name}</span>
              </div>
              <button onClick={handleLogout} className="logout-button">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="dashboard-main">
          {error && (
            <div className="error-banner">
              {error}
              <button onClick={loadDashboardData} className="retry-button">
                Reintentar
              </button>
            </div>
          )}

          {/* Stats Grid */}
          <section className="stats-grid">
            <div className="stat-card users">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>Usuarios</h3>
                <p className="stat-number">{stats.users}</p>
              </div>
            </div>
            <div className="stat-card drivers">
              <div className="stat-icon">🚗</div>
              <div className="stat-content">
                <h3>Conductores</h3>
                <p className="stat-number">{stats.drivers}</p>
              </div>
            </div>

            <div className="stat-card vehicles">
              <div className="stat-icon">🚛</div>
              <div className="stat-content">
                <h3>Vehículos</h3>
                <p className="stat-number">{stats.vehicles}</p>
              </div>
            </div>

            <div className="stat-card services">
              <div className="stat-icon">⚙️</div>
              <div className="stat-content">
                <h3>Servicios</h3>
                <p className="stat-number">{stats.services}</p>
              </div>
            </div>

            <div className="stat-card requests">
              <div className="stat-icon">🚨</div>
              <div className="stat-content">
                <h3>Solicitudes</h3>
                <p className="stat-number">{stats.towRequests}</p>
              </div>
            </div>

            <div className="stat-card tenants">
              <div className="stat-icon">🏢</div>
              <div className="stat-content">
                <h3>Empresas</h3>
                <p className="stat-number">{stats.tenants}</p>
              </div>
            </div>
          </section>

          {/* Recent Requests */}
          <section className="recent-requests">
            <h2>📋 Solicitudes Recientes</h2>
            {recentRequests.length > 0 ? (
              <div className="requests-table">
                <div className="table-header">
                  <div>ID</div>
                  <div>Origen</div>
                  <div>Destino</div>
                  <div>Estado</div>
                  <div>Precio</div>
                  <div>Fecha</div>
                </div>
                {recentRequests.map((request) => (
                  <div key={request.id} className="table-row">
                    <div>#{request.id}</div>
                    <div className="truncate">{request.origin_address}</div>
                    <div className="truncate">{request.destination_address}</div>
                    <div>{getStatusBadge(request.status)}</div>
                    <div>${request.total_price}</div>
                    <div>{formatDate(request.requested_at)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No hay solicitudes recientes</p>
              </div>
            )}
          </section>

          {/* Quick Actions */}
          <section className="quick-actions">
            <h2>⚡ Acciones Rápidas</h2>
            <div className="actions-grid">
              <button className="action-button" onClick={() => alert('Funcionalidad próximamente')}>
                ➕ Nueva Solicitud
              </button>
              <button className="action-button" onClick={() => alert('Funcionalidad próximamente')}>
                🚗 Gestionar Conductores
              </button>
              <button className="action-button" onClick={() => alert('Funcionalidad próximamente')}>
                🚛 Gestionar Vehículos
              </button>
              <button className="action-button" onClick={loadDashboardData}>
                🔄 Actualizar Datos
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
