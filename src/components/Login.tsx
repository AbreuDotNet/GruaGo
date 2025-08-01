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
      <div className="login-card">
        <div className="login-header">
          <h1>🚛 GruaGo</h1>
          <p>Sistema de Gestión de Grúas</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
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
            <label htmlFor="password">Contraseña</label>
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
          <hr />
          <p>🧪 <strong>Datos de prueba:</strong></p>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="demo-button"
            disabled={isLoading}
          >
            Usar credenciales de demo
          </button>
          <small>Email: juan.perez@email.com | Password: password123</small>
        </div>

        <div className="login-footer">
          <p>© 2025 GruaGo - Sistema de Gestión de Grúas</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
