import { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStock, setFilterStock] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    price: '',
    minStock: '10',
    category: 'General'
  });
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, filterCategory, filterStock]);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
      setFilteredProducts(response.data);
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

  const filterProducts = () => {
    let filtered = [...products];

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (filterCategory) {
      filtered = filtered.filter(p => p.category === filterCategory);
    }

    // Filtrar por stock
    if (filterStock === 'low') {
      filtered = filtered.filter(p => p.quantity <= (p.minStock || 10));
    } else if (filterStock === 'normal') {
      filtered = filtered.filter(p => p.quantity > (p.minStock || 10));
    }

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('');
    setFilterStock('');
  };

  const exportToExcel = () => {
    // Crear CSV (compatible con Excel)
    const headers = ['ID', 'Nombre', 'Categoría', 'Descripción', 'Stock', 'Precio', 'Stock Mínimo'];
    const csvContent = [
      headers.join(','),
      ...filteredProducts.map(p => [
        p.id,
        `"${p.name}"`,
        p.category || 'General',
        `"${p.description || ''}"`,
        p.quantity,
        p.price,
        p.minStock || 10
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventario_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    // Crear contenido HTML para PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Reporte de Inventario</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #667eea; text-align: center; }
          .date { text-align: center; color: #666; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #667eea; color: white; padding: 12px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #ddd; }
          tr:hover { background: #f5f5f5; }
          .total { margin-top: 20px; font-weight: bold; font-size: 18px; }
        </style>
      </head>
      <body>
        <h1>📦 Reporte de Inventario</h1>
        <div class="date">Generado el: ${new Date().toLocaleDateString('es-ES')}</div>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Precio</th>
              <th>Valor Total</th>
            </tr>
          </thead>
          <tbody>
            ${filteredProducts.map(p => `
              <tr>
                <td>${p.name}</td>
                <td>${p.category || 'General'}</td>
                <td>${p.quantity}</td>
                <td>$${p.price}</td>
                <td>$${(p.quantity * p.price).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="total">
          Total de productos: ${filteredProducts.length}<br>
          Valor total del inventario: $${filteredProducts.reduce((sum, p) => sum + (p.quantity * p.price), 0).toFixed(2)}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventario_${new Date().toISOString().split('T')[0]}.html`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('PDF generado como HTML. Ábrelo y usa "Imprimir > Guardar como PDF" en tu navegador.');
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
      setFormData({ name: '', description: '', quantity: '', price: '', minStock: '10', category: 'General' });
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
      price: product.price,
      minStock: product.minStock || '10',
      category: product.category || 'General'
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
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            🏠 Dashboard
          </button>
          <button onClick={() => navigate('/suppliers')} className="btn-secondary">
            🏢 Proveedores
          </button>
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

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filters">
          <button onClick={() => exportToExcel()} className="btn-export">
            📥 Exportar Excel
          </button>
          <button onClick={() => exportToPDF()} className="btn-export">
            📄 Exportar PDF
          </button>
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas las categorías</option>
            <option value="General">General</option>
            <option value="Electrónica">Electrónica</option>
            <option value="Oficina">Oficina</option>
            <option value="Hogar">Hogar</option>
            <option value="Tecnología">Tecnología</option>
            <option value="Otros">Otros</option>
          </select>
          
          <select 
            value={filterStock} 
            onChange={(e) => setFilterStock(e.target.value)}
            className="filter-select"
          >
            <option value="">Todo el stock</option>
            <option value="low">Stock bajo</option>
            <option value="normal">Stock normal</option>
          </select>

          {(searchTerm || filterCategory || filterStock) && (
            <button onClick={clearFilters} className="btn-clear">
              ✖ Limpiar filtros
            </button>
          )}
          
          <span className="results-count">
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <p>No se encontraron productos</p>
          </div>
        ) : (
          filteredProducts.map((product) => {
          const isLowStock = product.quantity <= (product.minStock || 10);
          return (
            <div key={product.id} className={`product-card ${isLowStock ? 'low-stock' : ''}`}>
              {isLowStock && <div className="low-stock-badge">⚠️ Stock Bajo</div>}
              <div className="product-category">{product.category || 'General'}</div>
              <h3>{product.name}</h3>
              <p className="description">{product.description}</p>
              <div className="product-info">
                <span className={`quantity ${isLowStock ? 'quantity-low' : ''}`}>
                  Stock: {product.quantity} {isLowStock && `(Mín: ${product.minStock || 10})`}
                </span>
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
          );
        })
        )}
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
                <label>Categoría</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="General">General</option>
                  <option value="Electrónica">Electrónica</option>
                  <option value="Oficina">Oficina</option>
                  <option value="Hogar">Hogar</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Otros">Otros</option>
                </select>
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
              <div className="form-group">
                <label>Stock Mínimo (para alertas)</label>
                <input
                  type="number"
                  name="minStock"
                  value={formData.minStock}
                  onChange={handleChange}
                  required
                  min="0"
                />
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