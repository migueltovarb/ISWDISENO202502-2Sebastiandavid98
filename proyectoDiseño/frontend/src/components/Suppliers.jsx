import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Suppliers.css';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    phone: '',
    email: '',
    address: ''
  });
  const { logout, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/suppliers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
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
      const url = editingSupplier 
        ? `http://localhost:8080/api/suppliers/${editingSupplier.id}`
        : 'http://localhost:8080/api/suppliers';
      
      const method = editingSupplier ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowModal(false);
        setEditingSupplier(null);
        setFormData({ name: '', contact: '', phone: '', email: '', address: '' });
        fetchSuppliers();
      } else {
        const error = await response.text();
        alert(error);
      }
    } catch (error) {
      console.error('Error al guardar proveedor:', error);
      alert('Error al guardar el proveedor');
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contact: supplier.contact || '',
      phone: supplier.phone || '',
      email: supplier.email,
      address: supplier.address || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este proveedor?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/suppliers/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          fetchSuppliers();
        } else {
          const error = await response.text();
          alert(error);
        }
      } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        alert('Error al eliminar el proveedor');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Cargando proveedores...</div>;
  }

  return (
    <div className="suppliers-container">
      <header className="suppliers-header">
        <h1>🏢 Gestión de Proveedores</h1>
        <div className="header-actions">
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            🏠 Dashboard
          </button>
          <button onClick={() => navigate('/products')} className="btn-secondary">
            📦 Productos
          </button>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            ➕ Nuevo Proveedor
          </button>
          <button onClick={handleLogout} className="btn-logout">
            🚪 Salir
          </button>
        </div>
      </header>

      <div className="suppliers-grid">
        {suppliers.length === 0 ? (
          <div className="empty-state">
            <p>No hay proveedores registrados</p>
          </div>
        ) : (
          suppliers.map((supplier) => (
            <div key={supplier.id} className="supplier-card">
              <h3>{supplier.name}</h3>
              <div className="supplier-info">
                <p><strong>👤 Contacto:</strong> {supplier.contact || 'N/A'}</p>
                <p><strong>📧 Email:</strong> {supplier.email}</p>
                <p><strong>📞 Teléfono:</strong> {supplier.phone || 'N/A'}</p>
                <p><strong>📍 Dirección:</strong> {supplier.address || 'N/A'}</p>
              </div>
              <div className="supplier-actions">
                <button onClick={() => handleEdit(supplier)} className="btn-edit">
                  ✏️ Editar
                </button>
                <button onClick={() => handleDelete(supplier.id)} className="btn-delete">
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre de la Empresa *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Distribuidora XYZ"
                />
              </div>
              
              <div className="form-group">
                <label>Persona de Contacto</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="contacto@empresa.com"
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="555-1234"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Dirección</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Dirección completa"
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingSupplier ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
