
import React, { useState } from 'react';
import { createCat } from '../api';

const CreateCategory = ({ onClose }) => {
  const [inputValue, setInput] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = { name: inputValue };
    createCat(data);
    setInput(""); 
  };

  return (
    <div className='form-container'>
      
      <form onSubmit={handleSubmit}> 
        <p>Název kategorie</p>
        <input className="form-input"
          type='text'
          value={inputValue}
          onChange={(e) => setInput(e.target.value)}
          required
        />
        <div className="form-button-group">
          <button className="form-button submit-button" type="submit">Hotovo</button>
          <button className="form-button cancel-button" onClick={onClose}>Zavřít</button>
        </div>
      </form>
    </div>
  );
};

export default CreateCategory;