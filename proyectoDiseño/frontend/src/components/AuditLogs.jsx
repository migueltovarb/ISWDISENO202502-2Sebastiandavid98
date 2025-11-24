import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AuditLogs.css';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('');
  const [filterResource, setFilterResource] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const { logout, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, filterAction, filterResource, dateFrom, dateTo]);

  const fetchLogs = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/audit', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setLogs(data);
      setFilteredLogs(data);
    } catch (error) {
      console.error('Error al cargar logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = [...logs];

    if (filterAction) {
      filtered = filtered.filter(log => log.action === filterAction);
    }

    if (filterResource) {
      filtered = filtered.filter(log => log.resource === filterResource);
    }

    if (dateFrom) {
      filtered = filtered.filter(log => 
        new Date(log.timestamp) >= new Date(dateFrom)
      );
    }

    if (dateTo) {
      filtered = filtered.filter(log => 
        new Date(log.timestamp) <= new Date(dateTo)
      );
    }

    setFilteredLogs(filtered);
  };

  const clearFilters = () => {
    setFilterAction('');
    setFilterResource('');
    setDateFrom('');
    setDateTo('');
  };

  const getActionBadge = (action) => {
    const badges = {
      'CREATE': { icon: '➕', class: 'badge-create' },
      'UPDATE': { icon: '✏️', class: 'badge-update' },
      'DELETE': { icon: '🗑️', class: 'badge-delete' },
      'LOGIN': { icon: '🔓', class: 'badge-login' },
      'LOGOUT': { icon: '🔒', class: 'badge-logout' }
    };
    const badge = badges[action] || { icon: '📝', class: 'badge-default' };
    return <span className={`action-badge ${badge.class}`}>{badge.icon} {action}</span>;
  };

  const getResourceIcon = (resource) => {
    const icons = {
      'PRODUCT': '📦',
      'SUPPLIER': '🏢',
      'TRANSACTION': '📊',
      'USER': '👤'
    };
    return icons[resource] || '📄';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Cargando logs de auditoría...</div>;
  }

  return (
    <div className="audit-container">
      <header className="audit-header">
        <h1>🔍 Auditoría del Sistema</h1>
        <div className="header-actions">
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            🏠 Dashboard
          </button>
          <button onClick={handleLogout} className="btn-logout">
            🚪 Salir
          </button>
        </div>
      </header>

      <div className="filters-section">
        <h3>Filtros de Auditoría</h3>
        <div className="filters">
          <div className="filter-group">
            <label>Acción:</label>
            <select 
              value={filterAction} 
              onChange={(e) => setFilterAction(e.target.value)}
              className="filter-select"
            >
              <option value="">Todas</option>
              <option value="CREATE">Crear</option>
              <option value="UPDATE">Actualizar</option>
              <option value="DELETE">Eliminar</option>
              <option value="LOGIN">Login</option>
              <option value="LOGOUT">Logout</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Recurso:</label>
            <select 
              value={filterResource} 
              onChange={(e) => setFilterResource(e.target.value)}
              className="filter-select"
            >
              <option value="">Todos</option>
              <option value="PRODUCT">Productos</option>
              <option value="SUPPLIER">Proveedores</option>
              <option value="TRANSACTION">Transacciones</option>
              <option value="USER">Usuarios</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Desde:</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="date-input"
            />
          </div>

          <div className="filter-group">
            <label>Hasta:</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="date-input"
            />
          </div>

          {(filterAction || filterResource || dateFrom || dateTo) && (
            <button onClick={clearFilters} className="btn-clear">
              ✖ Limpiar
            </button>
          )}

          <span className="results-count">
            {filteredLogs.length} registro{filteredLogs.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="logs-section">
        {filteredLogs.length === 0 ? (
          <div className="empty-state">
            <p>No se encontraron registros de auditoría</p>
          </div>
        ) : (
          <table className="logs-table">
            <thead>
              <tr>
                <th>Fecha y Hora</th>
                <th>Usuario</th>
                <th>Acción</th>
                <th>Recurso</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td className="timestamp">{formatDate(log.timestamp)}</td>
                  <td className="user">
                    <span className="user-badge">👤 {log.userName}</span>
                  </td>
                  <td>{getActionBadge(log.action)}</td>
                  <td className="resource">
                    {getResourceIcon(log.resource)} {log.resource}
                  </td>
                  <td className="details">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
