// src/pages/ConsultationIA.js
import React from 'react';

const ConsultationIA = () => {
  const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
      fontSize: '2em',
      marginBottom: '10px',
      color: '#333',
    },
    description: {
      fontSize: '1.2em',
      marginBottom: '20px',
      color: '#555',
    },
    iframe: {
      width: '100%',
      height: '800px',
      border: 'none',
      borderRadius: '8px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>ConsultationIA</h1>
      <p style={styles.description}>Interact with our medical chatbot.</p>
      <iframe style={styles.iframe} src="http://localhost:8501"></iframe>
    </div>
  );
};

export default ConsultationIA;
