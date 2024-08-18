import axios from "axios";
import { useState } from "react";

const Chat = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [diagnostic, setDiagnostic] = useState("");
  const [specialistes, setSpecialistes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:5005/diagnostic", {
        question: question,
      });
      setResponse(res.data.response);
      setDiagnostic(res.data.diagnostic);
      setSpecialistes(res.data.specialistes);
      setQuestion(""); // Clear the question input after submission
    } catch (error) {
      console.error("Erreur lors de la communication avec l'API:", error);
    }
  };

  return (
    <div className="fixed bottom-0 right-0 m-8 w-full max-w-md"> {/* Increased width */}
      <div className="flex justify-end">
        <button
          onClick={toggleChat}
          className="bg-blue-500 text-white px-4 py-3 rounded-full shadow-md focus:outline-none transition-transform transform hover:scale-105"
          style={{
            position: "fixed",
            bottom: "16px",
            right: "16px",
            zIndex: 9999,
          }}
        >
          {isOpen ? "Fermer le Chat" : "Ouvrir le Chat"}
        </button>
      </div>
      <div
        className="shadow-lg rounded-lg overflow-hidden"
        style={{
          position: "fixed",
          bottom: isOpen ? "80px" : "-1000px",
          right: "16px",
          zIndex: 9998,
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.3s, bottom 0.3s",
          pointerEvents: isOpen ? "auto" : "none",
          width: "360px",  // Increased width
          maxHeight: "500px",  // Increased height
          backgroundColor: "white",
          overflowY: "auto" // Allow scrolling
        }}
      >
        <div className="chat-container p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg text-blue-500">Assistant Virtuel</h3>
            <button
              onClick={toggleChat}
              className="text-red-500 focus:outline-none"
              style={{
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit} className="mb-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Posez votre question..."
              className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 transition"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white w-full py-2 rounded shadow-md hover:bg-blue-600 transition"
            >
              Envoyer
            </button>
          </form>
          {response && (
            <div className="response mt-4">
              <div className="mb-2">
                <h4 className="font-bold text-gray-700">Réponse:</h4>
                <p className="text-gray-600">{response}</p>
              </div>
              <div className="mb-2">
                <h4 className="font-bold text-gray-700">Diagnostic Préliminaire:</h4>
                <p className="text-gray-600">{diagnostic}</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-700">Spécialistes Recommandés:</h4>
                {specialistes.length > 0 ? (
                  <ul className="text-gray-600 list-disc list-inside">
                    {specialistes.map((specialiste, index) => (
                      <li key={index}>
                        {specialiste.name} ({specialiste.specialization})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">Aucun spécialiste trouvé.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;