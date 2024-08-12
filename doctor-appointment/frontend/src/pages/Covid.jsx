const Covid = () => {
    return (
        <section className="container">
          <h2 className="heading text-center">Prediction de covid</h2>
          <iframe
            src="http://localhost:8502"
            width="100%"
            height="600px"
            title="Prediction de maladie"
          ></iframe>
        </section>
      );
    };
export default Covid