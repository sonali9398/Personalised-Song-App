import React from 'react';
import './App.css'; // Make sure to create this CSS file

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      <p>Generating your song...</p>
    </div>
  );
};

export default Loader;
