import React, { useState } from 'react';
import "./ChatInput.css"

function ChatInput({ onSendMessage, disabled }) {
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="chat-input"
        value={message}
        onChange={handleChange}
        placeholder="Type a message..."
        disabled={disabled}
      />
      <button 
        type="submit" 
        className="send-button"
        disabled={disabled || !message.trim()}
      >
        Send
      </button>
    </form>
  );
}

export default ChatInput;