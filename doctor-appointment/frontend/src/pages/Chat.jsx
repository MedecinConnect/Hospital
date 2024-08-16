import React, { useState } from "react";

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-0 right-0 m-8 w-full max-w-xs">
      <div className="flex justify-end">
        <button
          onClick={toggleChat}
          className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-md"
          style={{
            position: 'fixed',
            bottom: '16px', // Keeps the button always at the bottom
            right: '16px', // Keeps the button always at the right side
            zIndex: 9999, // Ensure it's on top of other elements
          }}
        >
          {isOpen ? "Fermer le Chat" : "Ouvrir le Chat"}
        </button>
      </div>
      <div
        className="shadow-lg rounded-lg overflow-hidden mt-4"
        style={{
          position: 'fixed',
          bottom: isOpen ? '80px' : '-1000px', // Moves the chat off-screen when closed
          right: '16px',
          zIndex: 9998, // Just below the button
          opacity: isOpen ? 1 : 0, // Hide when closed
          transition: 'opacity 0.3s, bottom 0.3s', // Smooth transition
          pointerEvents: isOpen ? 'auto' : 'none', // Disable interaction when hidden
        }}
      >
        <iframe
          src="http://localhost:8501/"
          width="350px"
          height="500px"
          title="Chat with PDFs"
          style={{
            border: "none",
            borderRadius: "8px",
            display: "block",
            zIndex: 9997,
          }}
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default Chat;
