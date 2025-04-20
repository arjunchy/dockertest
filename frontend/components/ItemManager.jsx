import React, { useState, useEffect } from 'react';
import './ItemManager.css';

const API_BASE = 'http://localhost:3000';

const ItemManager = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopup, setShowPopup] = useState(false); // Manage modal visibility
  const [showSearchPopup, setShowSearchPopup] = useState(false); // Manage search modal visibility
  const [searchResults, setSearchResults] = useState([]);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_BASE}/items`);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      } else {
        setError('Failed to fetch items');
      }
    } catch {
      setError('Error fetching items');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', description: '' });
    setEditingId(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { name, price, description } = formData;
    if (!name || !price) {
      return setError('Name and price are required');
    }

    const payload = { name, price: Number(price), description };
    const url = editingId ? `${API_BASE}/items/${editingId}` : `${API_BASE}/newitem`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        resetForm();
        fetchItems();
      } else {
        setError('Operation failed');
      }
    } catch {
      setError('Network error');
    }
  };

  const handleEdit = (item) => {
    setFormData({ name: item.name, price: item.price.toString(), description: item.description || '' });
    setEditingId(item._id);
    setError('');
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/items/${id}`, { method: 'DELETE' });
      if (res.ok) fetchItems();
      else setError('Delete failed');
    } catch {
      setError('Network error');
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle search input and filtering items
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter items based on search term
    const results = items.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(results);
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const toggleSearchPopup = () => {
    setShowSearchPopup(!showSearchPopup);
  };

  return (
    <div className="container">
      {/* Top Navigation Bar */}
      <div className="navbar">
        <h2 className="title">📦 Item Manager</h2>
        <button onClick={togglePopup} className="btn show-items">Items List</button>
        <button onClick={toggleSearchPopup} className="btn show-search">Search</button>
      </div>

      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleSubmit} className="form-card">
        <h3>{editingId ? 'Edit Item' : 'Add New Item'}</h3>
        <input name="name" placeholder="Item Name" value={formData.name} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
        <div className="button-group">
          <button type="submit" className="btn primary">
            {editingId ? 'Update Item' : 'Add Item'}
          </button>
          {editingId && (
            <button type="button" className="btn secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Popup Modal for Items List */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>📝 Items List</h3>
            {filteredItems.length === 0 ? (
              <p>No items found.</p>
            ) : (
              <ul className="items-list">
                {filteredItems.map(item => (
                  <li key={item._id} className="item-card">
                    <strong>{item.name}</strong> — ${item.price}
                    <br />
                    <em>{item.description}</em>
                    <br />
                    <button onClick={() => handleEdit(item)} className="btn edit">Edit</button>
                    <button onClick={() => handleDelete(item._id)} className="btn delete">Delete</button>
                  </li>
                ))}
              </ul>
            )}
            <button className="btn close-popup" onClick={togglePopup}>Close</button>
          </div>
        </div>
      )}

      {/* Popup Modal for Search */}
      {showSearchPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>🔍 Search Items</h3>
            <input 
              type="text" 
              placeholder="Search by Item Name..." 
              value={searchTerm} 
              onChange={handleSearchChange} 
            />
            {searchResults.length === 0 ? (
              <p>No results found.</p>
            ) : (
              <ul className="items-list">
                {searchResults.map(item => (
                  <li key={item._id} className="item-card">
                    <strong>{item.name}</strong> — ${item.price}
                    <br />
                    <em>{item.description}</em>
                    <br />
                  </li>
                ))}
              </ul>
            )}
            <button className="btn close-popup" onClick={toggleSearchPopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemManager;
