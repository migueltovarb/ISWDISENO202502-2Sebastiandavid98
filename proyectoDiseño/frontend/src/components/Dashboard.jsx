import { useState, useEffect } from 'react';
import { getProducts, getTransactions } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockProducts: 0,
    recentTransactions: 0
  });
  const [lowStockList, setLowStockList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, transactionsRes] = await Promise.all([
        getProducts(),
        getTransactions()
      ]);

      const products = productsRes.data;
      const transactions = transactionsRes.data;

      // Calcular estadísticas
      const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
      const lowStock = products.filter(p => p.quantity <= (p.minStock || 10));
      
      // Transacciones de las últimas 24 horas
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const recentTrans = transactions.filter(t => new Date(t.date) > yesterday);

      setStats({
        totalProducts: products.length,
        totalValue: totalValue.toFixed(2),
        lowStockProducts: lowStock.length,
        recentTransactions: recentTrans.length
      });

      setLowStockList(lowStock);
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
      if (error.response?.status === 403 || error.response?.status === 401) {
        logout();
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Cargando dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>📊 Dashboard - Sistema de Inventario</h1>
        <div className="header-actions">
          <button onClick={() => navigate('/products')} className="btn-secondary">
            📦 Productos
          </button>
          <button onClick={() => navigate('/suppliers')} className="btn-secondary">
            🏢 Proveedores
          </button>
          <button onClick={() => navigate('/transactions')} className="btn-secondary">
            📊 Transacciones
          </button>
          <button onClick={() => navigate('/reports')} className="btn-secondary">
            📊 Informes
          </button>
          <button onClick={() => navigate('/audit')} className="btn-secondary">
            🔍 Auditoría
          </button>
          <button onClick={handleLogout} className="btn-logout">
            🚪 Salir
          </button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>Total Productos</h3>
            <p className="stat-value">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Valor Total Inventario</h3>
            <p className="stat-value">${stats.totalValue}</p>
          </div>
        </div>

        <div className="stat-card alert">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>Productos Stock Bajo</h3>
            <p className="stat-value">{stats.lowStockProducts}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <h3>Transacciones (24h)</h3>
            <p className="stat-value">{stats.recentTransactions}</p>
          </div>
        </div>
      </div>

      {lowStockList.length > 0 && (
        <div className="alert-section">
          <h2>⚠️ Alertas de Stock Bajo</h2>
          <div className="alert-list">
            {lowStockList.map((product) => (
              <div key={product.id} className="alert-item">
                <div className="alert-product-info">
                  <h4>{product.name}</h4>
                  <p className="alert-category">{product.category || 'General'}</p>
                </div>
                <div className="alert-stock-info">
                  <span className="current-stock">Stock: {product.quantity}</span>
                  <span className="min-stock">Mínimo: {product.minStock || 10}</span>
                </div>
                <button 
                  onClick={() => navigate('/products')} 
                  className="btn-action"
                >
                  Ver Producto
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {lowStockList.length === 0 && (
        <div className="no-alerts">
          <h2>✅ Todo en orden</h2>
          <p>No hay productos con stock bajo en este momento</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
