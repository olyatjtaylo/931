// ChatInterface.js
import React, { useState } from 'react';
import axios from 'axios';
import './ChatInterface.css';

function ChatInterface({ selectedLocation, setAiResponseLocation }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const response = await axios.post('/api/query', {
        query: input,
        latitude: selectedLocation?.lat,
        longitude: selectedLocation?.lng,
      });

      const botMessage = { sender: 'bot', text: response.data.text };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      // Update aiResponseLocation if provided by the backend
      if (response.data.location) {
        setAiResponseLocation(response.data.location);
      }
    } catch (error) {
      console.error('Error communicating with the backend:', error);
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <form className="chat-input" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about a location..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatInterface;
