/* eslint-disable react/prop-types */
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { AuthContext } from '../../context/AuthContext';

const FeedbackForm = ({ bookingId }) => {
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BASE_URL}/bookings/${bookingId}/feedback`,
        { feedback },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token here
          },
        }
      );

      setMessage('Feedback submitted successfully!');
      setFeedback('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setMessage('Failed to submit feedback.');
    }
  };

  return (
    <div className="feedback-form">
      <h3>Submit Feedback</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter your feedback"
          required
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FeedbackForm;