/*
import React, { useState, useEffect } from 'react';
import { createZap, fetchCategories } from '../api';
import '../App.css';

const CreateZapisek = ({ onClose }) => {
  const [nazev, setNazev] = useState("");
  const [details, setDetails] = useState("");
  const [kategorieId, setKategorieId] = useState("");
  const [kategorieList, setKategorieList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadKategorie = async () => {
    try {
      const kategorieData = await fetchCategories();
      if (kategorieData && Array.isArray(kategorieData.itemList)) {
        setKategorieList(kategorieData.itemList);
      } else if (Array.isArray(kategorieData)) {
        setKategorieList(kategorieData); // Handle if the backend directly returns an array
      } else {
        console.error("Error: Kategorie data is not in the expected format:", kategorieData);
        setError("Chyba při načítání kategorií: Data nebyla ve správném formátu.");
      }
      setLoading(false);
    } catch (err) {
      setError(err.message || "Chyba při načítání kategorií");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKategorie();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!nazev.trim()) {
      setError("Název zápisku je povinný.");
      return;
    }
    if (!details.trim()) {
      setError("Detail zápisku je povinný.");
      return;
    }
    if (!kategorieId) {
      setError("Musíte vybrat kategorii.");
      return;
    }
    const data = {
      nazev: nazev,
      details: details,
      kategorie: kategorieId,
    };
    try {
      await createZap(data);
      setNazev("");
      setDetails("");
      setKategorieId("");
      onClose();
    } catch (err) {
      setError(err.message || "Chyba při vytváření zápisku");
      console.error("Error creating zapisek:", err);
    }
  };

  if (loading) {
    return <div>Načítání kategorií...</div>;
  }

  if (error) {
    return <div className="error-message">Chyba: {error}</div>;
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Vytvořit Zápisek</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="nazev" className="form-label">Název:</label>
          <input
            type="text"
            id="nazev"
            value={nazev}
            onChange={(e) => setNazev(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="details" className="form-label">Detail:</label>
          <textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows="5"
            required
            className="form-textarea"
          />
        </div>
        <div className="form-group">
          <label htmlFor="kategorie" className="form-label">Kategorie:</label>
          <select
            id="kategorie"
            value={kategorieId}
            onChange={(e) => setKategorieId(e.target.value)}
            required
            className="form-select"
          >
            <option value="" disabled>Vyberte kategorii</option>
            {Array.isArray(kategorieList) ? (
              kategorieList.map((kategorie) => (
                <option key={kategorie.id} value={kategorie.id}>
                  {kategorie.name}
                </option>
              ))
            ) : (
              <option disabled>Chyba při načítání kategorií</option>
            )}
          </select>
        </div>
        <div className="form-button-group">
          <button className="form-button submit-button" type="submit">Hotovo</button>
          <button className="form-button cancel-button" onClick={onClose}>Zavřít</button>
        </div>
      </form>
    </div>
  );
};

export default CreateZapisek;
*/

import React, { useState, useEffect } from 'react';
import { createZap, fetchCategories } from '../api';
import '../App.css';

const CreateZapisek = ({ onClose }) => {
  const [nazev, setNazev] = useState("");
  const [details, setDetails] = useState("");
  const [kategorieId, setKategorieId] = useState("");
  const [kategorieList, setKategorieList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadKategorie = async () => {
    try {
      const kategorieData = await fetchCategories();
      if (kategorieData && Array.isArray(kategorieData.itemList)) {
        setKategorieList(kategorieData.itemList);
      } else if (Array.isArray(kategorieData)) {
        setKategorieList(kategorieData); // Handle if the backend directly returns an array
      } else {
        console.error("Error: Kategorie data is not in the expected format:", kategorieData);
        setError("Chyba při načítání kategorií: Data nebyla ve správném formátu.");
      }
      setLoading(false);
    } catch (err) {
      setError(err.message || "Chyba při načítání kategorií");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKategorie();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!nazev.trim()) {
      setError("Název zápisku je povinný.");
      return;
    }
    if (!details.trim()) {
      setError("Detail zápisku je povinný.");
      return;
    }
    if (!kategorieId) {
      setError("Musíte vybrat kategorii.");
      return;
    }

    // Find the selected category name from the kategorieList
    const selectedCategory = kategorieList.find(cat => cat._id === kategorieId);
    const categoryNameToSend = selectedCategory ? selectedCategory.name : null;

    if (!categoryNameToSend) {
      setError("Vybraná kategorie není platná.");
      return;
    }

    const data = {
      name: nazev, // Changed from nazev to name
      details: details,
      categoryName: categoryNameToSend, // Added categoryName
    };
    try {
      await createZap(data);
      setNazev("");
      setDetails("");
      setKategorieId("");
      onClose();
    } catch (err) {
      setError(err.message || "Chyba při vytváření zápisku");
      console.error("Error creating zapisek:", err);
    }
  };

  if (loading) {
    return <div>Načítání kategorií...</div>;
  }

  if (error) {
    return <div className="error-message">Chyba: {error}</div>;
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Vytvořit Zápisek</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="nazev" className="form-label">Název:</label>
          <input
            type="text"
            id="nazev"
            value={nazev}
            onChange={(e) => setNazev(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="details" className="form-label">Detail:</label>
          <textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows="5"
            required
            className="form-textarea"
          />
        </div>
        <div className="form-group">
          <label htmlFor="kategorie" className="form-label">Kategorie:</label>
          <select
            id="kategorie"
            value={kategorieId}
            onChange={(e) => setKategorieId(e.target.value)}
            required
            className="form-select"
          >
            <option value="" disabled>Vyberte kategorii</option>
            {Array.isArray(kategorieList) ? (
              kategorieList.map((kategorie) => (
                <option key={kategorie._id} value={kategorie._id}>
                  {kategorie.name}
                </option>
              ))
            ) : (
              <option disabled>Chyba při načítání kategorií</option>
            )}
          </select>
        </div>
        <div className="form-button-group">
          <button className="form-button submit-button" type="submit">Hotovo</button>
          <button className="form-button cancel-button" onClick={onClose}>Zavřít</button>
        </div>
      </form>
    </div>
  );
};

export default CreateZapisek;