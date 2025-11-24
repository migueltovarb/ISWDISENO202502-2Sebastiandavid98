import { useState, useEffect } from 'react';
import { getTransactions, createTransaction, getProducts } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Transactions.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    userId: '',
    quantity: '',
    type: 'IN'
  });
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transactionsRes, productsRes] = await Promise.all([
        getTransactions(),
        getProducts()
      ]);
      setTransactions(transactionsRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      if (error.response?.status === 403 || error.response?.status === 401) {
        logout();
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTransaction({
        ...formData,
        quantity: parseInt(formData.quantity),
        userId: '000000000000000000000000' // ID temporal
      });
      setShowModal(false);
      setFormData({ productId: '', userId: '', quantity: '', type: 'IN' });
      fetchData();
    } catch (error) {
      console.error('Error al crear transacción:', error);
      alert(error.response?.data || 'Error al crear la transacción');
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Producto desconocido';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Cargando transacciones...</div>;
  }

  return (
    <div className="transactions-container">
      <header className="transactions-header">
        <h1>📊 Historial de Transacciones</h1>
        <div className="header-actions">
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            🏠 Dashboard
          </button>
          <button onClick={() => navigate('/products')} className="btn-secondary">
            📦 Productos
          </button>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            ➕ Nueva Transacción
          </button>
          <button onClick={handleLogout} className="btn-logout">
            🚪 Salir
          </button>
        </div>
      </header>

      <div className="transactions-list">
        {transactions.length === 0 ? (
          <div className="empty-state">
            <p>No hay transacciones registradas</p>
          </div>
        ) : (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Producto</th>
                <th>Tipo</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{formatDate(transaction.date)}</td>
                  <td>{getProductName(transaction.productId)}</td>
                  <td>
                    <span className={`badge ${transaction.type === 'IN' ? 'badge-in' : 'badge-out'}`}>
                      {transaction.type === 'IN' ? '📥 Entrada' : '📤 Salida'}
                    </span>
                  </td>
                  <td className={transaction.type === 'IN' ? 'quantity-in' : 'quantity-out'}>
                    {transaction.type === 'IN' ? '+' : '-'}{transaction.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Nueva Transacción</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Producto</label>
                <select
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona un producto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} (Stock: {product.quantity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tipo de Transacción</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="IN">📥 Entrada (Agregar stock)</option>
                  <option value="OUT">📤 Salida (Retirar stock)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Cantidad</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Crear Transacción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
