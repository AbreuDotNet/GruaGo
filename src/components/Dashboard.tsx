import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Dashboard.css';

interface DashboardMetrics {
  totals: {
    users: number;
    drivers: number;
    vehicles: number;
    services: number;
    towRequests: number;
    tenants: number;
    activeRequests: number;
    completedRequests: number;
    totalRevenue: number;
    averageRating: string;
  };
  statusBreakdown: Array<{
    status: string;
    count: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    requests: number;
  }>;
  topDrivers: Array<{
    name: string;
    completedRequests: number;
    averageRating: string;
  }>;
}

interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
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

interface Notification {
  id: number;
  type: 'info' | 'warning' | 'success' | 'error';
  icon: string;
  title: string;
  message: string;
  time: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessages, setToastMessages] = useState<ToastMessage[]>([]);
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Mock notifications data
  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'info',
      icon: '🔔',
      title: 'Nueva solicitud recibida',
      message: 'Solicitud de grúa en Zona Norte, requiere atención.',
      time: 'Hace 5 min'
    },
    {
      id: 2,
      type: 'success',
      icon: '✅',
      title: 'Servicio completado',
      message: 'Solicitud #1234 finalizada exitosamente.',
      time: 'Hace 15 min'
    },
    {
      id: 3,
      type: 'warning',
      icon: '⚠️',
      title: 'Conductor sin asignar',
      message: 'Hay 3 solicitudes pendientes de asignación.',
      time: 'Hace 30 min'
    },
    {
      id: 4,
      type: 'info',
      icon: '👤',
      title: 'Nuevo usuario registrado',
      message: 'Usuario María García se registró en el sistema.',
      time: 'Hace 1 hora'
    }
  ]);

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
    if (user) {
      loadDashboardData();
    } else {
      console.log('No user found, waiting for authentication...');
    }
  }, [user]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isUserMenuOpen && !target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Toast functions
  const showToast = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    const id = Date.now();
    const newToast: ToastMessage = { id, type, message };
    setToastMessages(prev => [...prev, newToast]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id: number) => {
    setToastMessages(prev => prev.filter(toast => toast.id !== id));
  };

  const loadDashboardData = async () => {
    try {
      console.log('Loading dashboard data...');
      setIsLoading(true);

      // Check if user is authenticated
      if (!user) {
        console.error('No user authenticated');
        showToast('error', 'Usuario no autenticado');
        return;
      }

      // Check if token exists in cookies
      const token = Cookies.get('auth_token');

      // Load dashboard metrics from new endpoint
      const [metricsRes, towRequestsRes] = await Promise.all([
        axios.get('/dashboard/metrics'),
        axios.get('/tow-requests'),
      ]);

      // Set metrics state
      setMetrics(metricsRes.data);

      // Get recent requests (last 5) - handle the API response structure
      const requestsData = towRequestsRes.data.data || towRequestsRes.data;
      const sortedRequests = requestsData
        .sort((a: RecentRequest, b: RecentRequest) => 
          new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime()
        )
        .slice(0, 5);
      
      setRecentRequests(sortedRequests);
      showToast('success', 'Datos del dashboard actualizados correctamente');

    } catch (error: any) {
      console.error('Error details:', error.response?.data || error.message);
      showToast('error', 'Error al cargar los datos del dashboard');
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

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleMenuAction = (action: string) => {
    setIsUserMenuOpen(false);
    
    switch (action) {
      case 'profile':
        showToast('info', 'Perfil de usuario - próximamente');
        break;
      case 'settings':
        showToast('info', 'Configuración - próximamente');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
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
              <span className="user-display-name">{user?.full_name}</span>
              <div className="user-menu-container">
                <button 
                  className="user-menu-trigger"
                  onClick={toggleUserMenu}
                  aria-label="Menú de usuario"
                >
                  <div className="user-avatar">
                    <span className="avatar-initial">
                      {user?.full_name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <svg 
                    className={`menu-arrow ${isUserMenuOpen ? 'open' : ''}`} 
                    width="12" 
                    height="12" 
                    viewBox="0 0 12 12"
                  >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                </button>
                
                {isUserMenuOpen && (
                  <div className="user-dropdown-menu">
                    <div className="dropdown-header">
                      <div className="dropdown-user-info">
                        <div className="dropdown-avatar">
                          <span>{user?.full_name?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="dropdown-text">
                          <span className="dropdown-name">{user?.full_name}</span>
                          <span className="dropdown-tenant">{user?.tenant_name}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <div className="dropdown-items">
                      <button 
                        className="dropdown-item"
                        onClick={() => handleMenuAction('profile')}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span>Mi Perfil</span>
                      </button>
                      
                      <button 
                        className="dropdown-item"
                        onClick={() => handleMenuAction('settings')}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                          <path d="M12 1v6m0 6v6m11-6h-6m-6 0H1" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span>Configuración</span>
                      </button>
                      
                      <div className="dropdown-divider"></div>
                      
                      <button 
                        className="dropdown-item logout-item"
                        onClick={() => handleMenuAction('logout')}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2"/>
                          <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2"/>
                          <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="dashboard-main">
          {/* Stats Grid */}
          <section className="stats-grid">
            {/* <div className="stat-card users">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>Usuarios Activos</h3>
                <p className="stat-number">{metrics?.totals.users || 0}</p>
                <span className="stat-change">Registrados en el sistema</span>
              </div>
            </div>*/}
            
            <div className="stat-card drivers">
              <div className="stat-icon">🚗</div>
              <div className="stat-content">
                <h3>Conductores</h3>
                <p className="stat-number">{metrics?.totals.drivers || 0}</p>
                <span className="stat-change">Activos disponibles</span>
              </div>
            </div>

            <div className="stat-card vehicles">
              <div className="stat-icon">🚛</div>
              <div className="stat-content">
                <h3>Vehículos</h3>
                <p className="stat-number">{metrics?.totals.vehicles || 0}</p>
                <span className="stat-change">En la flota</span>
              </div>
            </div>

            <div className="stat-card requests">
              <div className="stat-icon">🚨</div>
              <div className="stat-content">
                <h3>Solicitudes Activas</h3>
                <p className="stat-number">{metrics?.totals.activeRequests || 0}</p>
                <span className="stat-change">En proceso</span>
              </div>
            </div>

            <div className="stat-card total-requests">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <h3>Total Solicitudes</h3>
                <p className="stat-number">{metrics?.totals.towRequests || 0}</p>
                <span className="stat-change">En el sistema</span>
              </div>
            </div>

            <div className="stat-card completed">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>Completadas</h3>
                <p className="stat-number">{metrics?.totals.completedRequests || 0}</p>
                <span className="stat-change">Servicios finalizados</span>
              </div>
            </div>

            <div className="stat-card revenue">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>Ingresos Totales</h3>
                <p className="stat-number">${(metrics?.totals.totalRevenue || 0).toLocaleString()}</p>
                <span className="stat-change">⭐ {metrics?.totals.averageRating || 'N/A'} promedio</span>
              </div>
            </div>

            <div className="stat-card services">
              <div className="stat-icon">⚙️</div>
              <div className="stat-content">
                <h3>Servicios</h3>
                <p className="stat-number">{metrics?.totals.services || 0}</p>
                <span className="stat-change">Tipos disponibles</span>
              </div>
            </div>

            <div className="stat-card tenants">
              <div className="stat-icon">🏢</div>
              <div className="stat-content">
                <h3>Empresas</h3>
                <p className="stat-number">{metrics?.totals.tenants || 0}</p>
                <span className="stat-change">Tenants activos</span>
              </div>
            </div>
          </section>

          {/* Status Breakdown */}
          <section className="status-breakdown">
            <h2>📊 Desglose por Estado</h2>
            <div className="status-grid">
              {metrics?.statusBreakdown?.map((status) => (
                <div key={status.status} className={`status-item status-${status.status}`}>
                  <div className="status-count">{status.count}</div>
                  <div className="status-label">
                    {status.status === 'pending' && 'Pendientes'}
                    {status.status === 'assigned' && 'Asignadas'}
                    {status.status === 'in_progress' && 'En Progreso'}
                    {status.status === 'completed' && 'Completadas'}
                    {status.status === 'cancelled' && 'Canceladas'}
                  </div>
                </div>
              )) || (
                <div className="empty-state">
                  <p>No hay datos de estado disponibles</p>
                </div>
              )}
            </div>
          </section>

          {/* Top Drivers */}
          <section className="top-drivers">
            <h2>🏆 Mejores Conductores</h2>
            <div className="drivers-list">
              {metrics?.topDrivers?.slice(0, 5).map((driver, index) => (
                <div key={`${driver.name}-${index}`} className="driver-item">
                  <div className="driver-rank">#{index + 1}</div>
                  <div className="driver-info">
                    <div className="driver-name">{driver.name}</div>
                    <div className="driver-stats">
                      {driver.completedRequests} servicios • ⭐ {driver.averageRating}
                    </div>
                  </div>
                </div>
              )) || (
                <div className="empty-state">
                  <p>No hay datos de conductores disponibles</p>
                </div>
              )}
            </div>
          </section>

          {/* Bottom Sections - Two Columns */}
          <div className="bottom-sections">
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

            {/* Notifications */}
            <section className="notifications">
              <h2>🔔 Notificaciones</h2>
              <div className="notifications-list">
                {notifications.map((notification) => (
                  <div key={notification.id} className="notification-item">
                    <div className="notification-icon">{notification.icon}</div>
                    <div className="notification-content">
                      <div className="notification-title">{notification.title}</div>
                      <div className="notification-message">{notification.message}</div>
                      <div className="notification-time">{notification.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Quick Actions */}
          <section className="quick-actions">
            <h2>⚡ Acciones Rápidas</h2>
            <div className="actions-grid">
              <button className="action-button" onClick={() => showToast('info', 'Funcionalidad próximamente')}>
                ➕ Nueva Solicitud
              </button>
              <button className="action-button" onClick={() => showToast('info', 'Funcionalidad próximamente')}>
                🚗 Gestionar Conductores
              </button>
              <button className="action-button" onClick={() => showToast('info', 'Funcionalidad próximamente')}>
                🚛 Gestionar Vehículos
              </button>
              <button className="action-button" onClick={loadDashboardData}>
                🔄 Actualizar Datos
              </button>
            </div>
          </section>
        </main>
      </div>

      {/* Toast Messages */}
      <div className="toast-container">
        {toastMessages.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            onClick={() => removeToast(toast.id)}
          >
            <div className="toast-content">
              <span className="toast-icon">
                {toast.type === 'success' && '✅'}
                {toast.type === 'error' && '❌'}
                {toast.type === 'warning' && '⚠️'}
                {toast.type === 'info' && 'ℹ️'}
              </span>
              <span className="toast-message">{toast.message}</span>
            </div>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
