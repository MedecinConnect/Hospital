// src/pages/Prediction.jsx
import React from "react";

const Prediction = () => {
  return (
    <section className="container">
      <h2 className="heading text-center">Prediction de maladie</h2>
      <iframe
        src="http://localhost:8503"
        width="100%"
        height="600px"
        title="Prediction de maladie"
      ></iframe>
    </section>
  );
};

export default Prediction;
