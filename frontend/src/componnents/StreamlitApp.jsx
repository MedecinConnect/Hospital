// src/components/StreamlitApp.jsx

import React, { useState } from 'react';

const StreamlitApp = () => {
  const [showIframe, setShowIframe] = useState(false); // État pour contrôler l'affichage de l'iframe

  const handleButtonClick = () => {
    setShowIframe(!showIframe); // Toggle l'état
  };

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        <button
          onClick={handleButtonClick}
          className="btn bg-primaryColor text-white py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-secondaryColor"
        >
          {showIframe ? 'Hide Streamlit App' : 'Show Streamlit App'}
        </button>
        {showIframe && (
          <iframe
            src="http://localhost:8501/"
            width="100%"
            height="600px"
            className="rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out mt-6"
            title="Streamlit App"
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default StreamlitApp;
