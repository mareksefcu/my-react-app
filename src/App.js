
import React, { useState, useEffect } from 'react';
import CreateCategory from './components/CreateCategory';
import CreateZapisek from './components/CreateZapisek';
import ZapisekList from './components/ZapisekList';
import './App.css';

function App() {
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showZapisekForm, setShowZapisekForm] = useState(false);
  const [refreshZapisky, setRefreshZapisky] = useState(false);

  const handleCreateCategoryClick = () => {
    setShowCategoryForm(true);
    setShowZapisekForm(false);
  };

  const handleCreateZapisekClick = () => {
    setShowZapisekForm(true);
    setShowCategoryForm(false);
  };

  const handleZapisekCreated = () => {
    setRefreshZapisky(prev => !prev); // Trigger a refresh of the zápisky list
    setShowZapisekForm(false);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Note Taking App</h1>
      <div className="button-container">
        <button onClick={handleCreateCategoryClick} className="app-button create-category-button">Vytvořit kategorii</button>
        <button onClick={handleCreateZapisekClick} className="app-button create-zapisek-button">Vytvořit zápisek</button>
      </div>

      {showCategoryForm && (
        <div className="form-wrapper">
          <h2>Create Category</h2>
          <CreateCategory onClose={() => setShowCategoryForm(false)} />
        </div>
      )}

      {showZapisekForm && (
        <div className="form-wrapper">
          <h2>Create Zapisek</h2>
          <CreateZapisek onClose={handleZapisekCreated} />
        </div>
      )}

      <ZapisekList refresh={refreshZapisky} />
    </div>
  );
}

export default App;
