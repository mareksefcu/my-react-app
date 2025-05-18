import React, { useState, useEffect } from 'react';
import { download, deleteZap, updateZapisek, fetchZaps, fetchCategories } from '../api';
import '../App.css';

const ZapisekList = ({ refresh }) => {
  const [zapisky, setZapisky] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editText, setEditText] = useState('');
  const [editingCategory, setEditingCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    loadZapisky();
    loadCategories();
  }, [refresh]);

  const loadCategories = async () => {
    try {
      const categoriesData = await fetchCategories();
      if (Array.isArray(categoriesData)) {
        setCategories(categoriesData);
      } else if (categoriesData && Array.isArray(categoriesData.itemList)) {
        setCategories(categoriesData.itemList);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Failed to load categories');
    }
  };

  const loadZapisky = async () => {
    setLoading(true);
    try {
      const data = await fetchZaps();
      setZapisky(data);
      setError('');
    } catch (err) {
      setError('Failed to load zapisky');
      console.error('Error loading zapisky:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (zapisek) => {
    setDownloadingId(zapisek._id);
    try {
      const blob = await download({ name: zapisek.name });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `${zapisek.name}.pdf`;
      
      // Append to document, click, and cleanup
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download zapisek');
      console.error('Error downloading zapisek:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Opravdu chcete smazat tento zápisek?')) {
      setLoading(true);
      try {
        await deleteZap(id);
        setZapisky(prevZapisky => prevZapisky.filter(zapisek => zapisek._id !== id));
      } catch (err) {
        setError('Failed to delete zapisek');
        console.error('Error deleting zapisek:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditClick = (zapisek) => {
    setEditingId(zapisek._id);
    setEditText(zapisek.details);
    setEditingName(zapisek.name);
    setEditingCategory(zapisek.categoryName || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setEditText('');
    setEditingCategory('');
  };

  const handleNameChange = (event) => {
    setEditingName(event.target.value);
  };

  const handleTextChange = (event) => {
    setEditText(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setEditingCategory(event.target.value);
  };

  const handleSaveEdit = async (zapisek) => {
    setLoading(true);
    setError('');
    try {
      const selectedCategory = categories.find(cat => cat.name === editingCategory);
      if (!selectedCategory) {
        throw new Error('Selected category not found');
      }

      // Ensure we have valid data
      if (!zapisek._id || !selectedCategory._id) {
        throw new Error('Invalid ID data');
      }

      // Create update data with proper string conversions
      const updateData = {
        id: zapisek._id.toString(),
        name: editingName.trim(),
        details: editText.trim(),
        categoryName: selectedCategory.name.trim(),
        categoryId: selectedCategory._id.toString()
      };

      // Log the data for debugging
      console.log('Update data being sent:', updateData);

      // Validate all required fields are present and non-empty
      const requiredFields = ['id', 'name', 'details', 'categoryName', 'categoryId'];
      const missingFields = requiredFields.filter(field => !updateData[field]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate ObjectId format
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      if (!objectIdRegex.test(updateData.id) || !objectIdRegex.test(updateData.categoryId)) {
        throw new Error('Invalid ID format');
      }

      const result = await updateZapisek(zapisek._id, updateData);
      
      if (!result || !result._id) {
        throw new Error('Invalid response from server');
      }

      // Update local state only after successful API call
      setZapisky(prevZapisky =>
        prevZapisky.map(item =>
          item._id === zapisek._id
            ? {
                ...item,
                name: result.name || updateData.name,
                details: result.details || updateData.details,
                categoryName: result.categoryName || updateData.categoryName,
                categoryId: result.categoryId || updateData.categoryId,
                updatedAt: result.updatedAt || new Date()
              }
            : item
        )
      );
      setEditingId(null);
      setEditingName('');
      setEditText('');
      setEditingCategory('');
    } catch (err) {
      console.error('Chyba při ukládání úprav:', err);
      if (err.message.includes('ObjectId')) {
        setError('Neplatný formát ID');
      } else if (err.message.includes('category')) {
        setError('Chyba kategorie: ' + err.message);
      } else {
        setError(err.message || 'Chyba při ukládání úprav.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Načítání zápisků...</div>;
  }

  if (error) {
    return <div className="error-message">Chyba: {error}</div>;
  }

  if (zapisky.length === 0) {
    return <div className="no-items-message">Žádné zápisky k zobrazení.</div>;
  }

  return (
    <div className="zapisek-list-container">
      <h2 className="list-title">Seznam Zápisků</h2>
      <ul className="zapisek-list">
        {zapisky.map((zapisek) => (
          <li key={zapisek._id} className="zapisek-item">
            {editingId === zapisek._id ? (
              <div className="edit-form">
                <h3>Upravit Zápisek</h3>
                <div className="form-group">
                  <label htmlFor={`edit-name-${zapisek._id}`}>Název:</label>
                  <input
                    type="text"
                    id={`edit-name-${zapisek._id}`}
                    value={editingName}
                    onChange={handleNameChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`edit-category-${zapisek._id}`}>Kategorie:</label>
                  <select
                    id={`edit-category-${zapisek._id}`}
                    value={editingCategory}
                    onChange={handleCategoryChange}
                    className="form-select"
                  >
                    <option value="" disabled>Vyberte kategorii</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor={`edit-text-${zapisek._id}`}>Text:</label>
                  <textarea
                    id={`edit-text-${zapisek._id}`}
                    value={editText}
                    onChange={handleTextChange}
                    className="form-textarea"
                  />
                </div>
                <div className="edit-buttons">
                  <button onClick={() => handleSaveEdit(zapisek)} disabled={loading} className="form-button submit-button">
                    Uložit
                  </button>
                  <button onClick={handleCancelEdit} disabled={loading} className="form-button cancel-button">
                    Zrušit
                  </button>
                </div>
                {error && <p className="error-message">{error}</p>}
              </div>
            ) : (
              <>
                <div className="zapisek-header">
                  <h3 className="zapisek-name">{zapisek.name}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div className="button-group">
                      <button
                        onClick={() => handleDownload(zapisek)}
                        disabled={downloadingId === zapisek._id}
                        className="form-button"
                      >
                        {downloadingId === zapisek._id ? 'Stahování...' : 'Stáhnout'}
                      </button>
                      <button onClick={() => handleEditClick(zapisek)} disabled={loading} className="form-button">
                        Upravit
                      </button>
                      <button onClick={() => handleDelete(zapisek._id)} disabled={loading} className="form-button cancel-button">
                        Smazat
                      </button>
                    </div>
                    <span className="zapisek-category">Kategorie: {zapisek.categoryName}</span>
                  </div>
                </div>
                <p className="zapisek-details">{zapisek.details}</p>
                <span className="zapisek-date">
                  Vytvořeno: {new Date(zapisek.createdAt).toLocaleDateString()}
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ZapisekList;