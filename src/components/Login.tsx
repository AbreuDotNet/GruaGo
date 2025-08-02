import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      // Navigation will be handled by App.tsx based on auth state
    } catch (error: any) {
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('juan.perez@email.com');
    setPassword('password123');
  };

  return (
    <div className="login-container">
      <div className="login-layout">
        {/* Columna Izquierda - Formulario */}
        <div className="login-left">
          <div className="login-form-container">
            <div className="login-icon">
              <div className="hexagon">
                <span className="hexagon-icon">🚛</span>
              </div>
            </div>

            <div className="login-header">
              <h1>GruaGo</h1>
              <p>Sistema de Gestión de Grúas</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">User</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu.email@ejemplo.com"
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Tu contraseña"
                  disabled={isLoading}
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>

            <div className="demo-section">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="demo-button"
                disabled={isLoading}
              >
                Usar credenciales de demo
              </button>
            </div>
          </div>
        </div>

        {/* Columna Derecha - Contenido Motivacional */}
        <div className="login-right">
          <div className="motivational-content">
            <div className="motivational-header">
              <h2>Bienvenido a GruaGo</h2>
              <p className="subtitle">Tu plataforma de gestión integral</p>
            </div>

            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">📊</div>
                <div className="feature-text">
                  <h3>Panel de Control Completo</h3>
                  <p>Gestiona todas tus operaciones desde un solo lugar</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">🚛</div>
                <div className="feature-text">
                  <h3>Gestión de Flota</h3>
                  <p>Controla vehículos, conductores y servicios en tiempo real</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">📱</div>
                <div className="feature-text">
                  <h3>Tecnología Moderna</h3>
                  <p>Interfaz intuitiva y herramientas avanzadas de análisis</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <div className="feature-text">
                  <h3>Respuesta Rápida</h3>
                  <p>Optimiza tiempos de respuesta y mejora la satisfacción del cliente</p>
                </div>
              </div>
            </div>

            <div className="motivational-quote">
              <blockquote>
                "La tecnología al servicio de la eficiencia en cada rescate"
              </blockquote>
              <cite>- Equipo GruaGo</cite>
            </div>

            <div className="announcements">
              <h4>📢 Novedades</h4>
              <ul>
                <li>✨ Nuevo sistema de métricas en tiempo real</li>
                <li>🔔 Notificaciones inteligentes implementadas</li>
                <li>📈 Dashboard mejorado con analytics avanzados</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
