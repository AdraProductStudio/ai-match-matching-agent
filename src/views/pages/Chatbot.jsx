import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const ChatBot = () => {
  const [messages, setMessages] = useState([{ type: 'bot', text: 'Welcome!' }]);
  const inactivityTimerRef = useRef(null);

  const sendMessage = (text) => {
    // Cancel old timer
    clearTimeout(inactivityTimerRef.current);

    // Send user's message to server
    setMessages(prev => [...prev, { type: 'user', text }]);

    // Simulate API response
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text: 'Thanks for your message!' }]);
    }, 1000);

    // Restart inactivity timer
    startInactivityTimer();
  };

  const startInactivityTimer = () => {
    inactivityTimerRef.current = setTimeout(() => {
      sendInactivityRequest();
    }, 5000); // 30 seconds of inactivity

    console.log("inactivityTimerRef.current",inactivityTimerRef)
  };

  const sendInactivityRequest = async () => {
    try {
      // You can hit your backend or just show a message
      // const response = await axios.post('/check-inactivity');

      setMessages(prev => [...prev, { type: 'bot', text: 'Are you still there?' }]);
    } catch (err) {
      console.error('Inactivity check failed:', err);
    }
  };

  useEffect(() => {
    // Start timer after welcome message
    startInactivityTimer();

    return () => clearTimeout(inactivityTimerRef.current); // Cleanup on unmount
  }, []);

  return (
    <div>
      <div style={{ border: '1px solid #ccc', padding: '1rem', height: '300px', overflowY: 'auto' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.type === 'bot' ? 'left' : 'right' }}>
            <p><strong>{msg.type === 'bot' ? 'Bot' : 'You'}:</strong> {msg.text}</p>
          </div>
        ))}
      </div>

      <input type="text" placeholder="Type here..." onKeyDown={(e) => {
        if (e.key === 'Enter') {
          sendMessage(e.target.value);
          e.target.value = '';
        }
      }} />
    </div>
  );
};

export default ChatBot;
