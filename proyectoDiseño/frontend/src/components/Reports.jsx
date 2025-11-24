import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Reports.css';

const Reports = () => {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    totalMovements: 0,
    mostMovedProducts: []
  });
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const { logout, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [products, transactions, dateFrom, dateTo, filterCategory]);

  const fetchData = async () => {
    try {
      const [productsRes, transactionsRes] = await Promise.all([
        fetch('http://localhost:8080/api/products', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:8080/api/transactions', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const productsData = await productsRes.json();
      const transactionsData = await transactionsRes.json();

      setProducts(productsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    let filteredProducts = [...products];
    let filteredTransactions = [...transactions];

    // Filtrar por categoría
    if (filterCategory) {
      filteredProducts = filteredProducts.filter(p => p.category === filterCategory);
    }

    // Filtrar transacciones por fecha
    if (dateFrom) {
      filteredTransactions = filteredTransactions.filter(t => 
        new Date(t.date) >= new Date(dateFrom)
      );
    }
    if (dateTo) {
      filteredTransactions = filteredTransactions.filter(t => 
        new Date(t.date) <= new Date(dateTo)
      );
    }

    // Calcular estadísticas
    const totalValue = filteredProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    // Productos más movidos
    const productMovements = {};
    filteredTransactions.forEach(t => {
      if (!productMovements[t.productId]) {
        productMovements[t.productId] = 0;
      }
      productMovements[t.productId] += t.quantity;
    });

    const mostMoved = Object.entries(productMovements)
      .map(([productId, count]) => {
        const product = products.find(p => p.id === productId);
        return { product, count };
      })
      .filter(item => item.product)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setStats({
      totalProducts: filteredProducts.length,
      totalValue: totalValue.toFixed(2),
      totalMovements: filteredTransactions.length,
      mostMovedProducts: mostMoved
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Cargando reportes...</div>;
  }

  return (
    <div className="reports-container">
      <header className="reports-header">
        <h1>📊 Informes y Reportes</h1>
        <div className="header-actions">
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            🏠 Dashboard
          </button>
          <button onClick={() => navigate('/products')} className="btn-secondary">
            📦 Productos
          </button>
          <button onClick={handleLogout} className="btn-logout">
            🚪 Salir
          </button>
        </div>
      </header>

      <div className="filters-section">
        <h3>Filtros de Reporte</h3>
        <div className="filters">
          <div className="filter-group">
            <label>Fecha Desde:</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="date-input"
            />
          </div>
          <div className="filter-group">
            <label>Fecha Hasta:</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="date-input"
            />
          </div>
          <div className="filter-group">
            <label>Categoría:</label>
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">Todas</option>
              <option value="General">General</option>
              <option value="Electrónica">Electrónica</option>
              <option value="Oficina">Oficina</option>
              <option value="Hogar">Hogar</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
          {(dateFrom || dateTo || filterCategory) && (
            <button 
              onClick={() => {
                setDateFrom('');
                setDateTo('');
                setFilterCategory('');
              }} 
              className="btn-clear"
            >
              ✖ Limpiar
            </button>
          )}
        </div>
      </div>

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
            <h3>Valor Total</h3>
            <p className="stat-value">${stats.totalValue}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <h3>Total Movimientos</h3>
            <p className="stat-value">{stats.totalMovements}</p>
          </div>
        </div>
      </div>

      <div className="report-section">
        <h2>📊 Productos Más Movidos</h2>
        {stats.mostMovedProducts.length === 0 ? (
          <p className="no-data">No hay datos de movimientos en el período seleccionado</p>
        ) : (
          <table className="report-table">
            <thead>
              <tr>
                <th>Posición</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Stock Actual</th>
                <th>Total Movimientos</th>
              </tr>
            </thead>
            <tbody>
              {stats.mostMovedProducts.map((item, index) => (
                <tr key={item.product.id}>
                  <td className="position">#{index + 1}</td>
                  <td><strong>{item.product.name}</strong></td>
                  <td>{item.product.category || 'General'}</td>
                  <td>{item.product.quantity}</td>
                  <td className="movements">{item.count} unidades</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="chart-section">
        <h2>📈 Resumen Visual</h2>
        <div className="chart-placeholder">
          <p>Gráfico de movimientos por categoría</p>
          <div className="simple-chart">
            {['General', 'Electrónica', 'Oficina', 'Hogar', 'Tecnología'].map(cat => {
              const count = products.filter(p => p.category === cat).length;
              const percentage = products.length > 0 ? (count / products.length) * 100 : 0;
              return (
                <div key={cat} className="chart-bar">
                  <div className="bar-label">{cat}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="bar-value">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
