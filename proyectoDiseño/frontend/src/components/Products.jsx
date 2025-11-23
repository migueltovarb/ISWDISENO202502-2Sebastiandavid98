import { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    price: ''
  });
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
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
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await createProduct(formData);
      }
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', quantity: '', price: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('Error al guardar el producto');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      quantity: product.quantity,
      price: product.price
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  return (
    <div className="products-container">
      <header className="products-header">
        <h1>📦 Gestión de Productos</h1>
        <div className="header-actions">
          <button onClick={() => navigate('/transactions')} className="btn-secondary">
            📊 Transacciones
          </button>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            ➕ Nuevo Producto
          </button>
          <button onClick={handleLogout} className="btn-logout">
            🚪 Salir
          </button>
        </div>
      </header>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p className="description">{product.description}</p>
            <div className="product-info">
              <span className="quantity">Stock: {product.quantity}</span>
              <span className="price">${product.price}</span>
            </div>
            <div className="product-actions">
              <button onClick={() => handleEdit(product)} className="btn-edit">
                ✏️ Editar
              </button>
              <button onClick={() => handleDelete(product.id)} className="btn-delete">
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Cantidad</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Precio</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;