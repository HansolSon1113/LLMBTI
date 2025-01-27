import React, { useState } from 'react';
import Invoke from "./OpenAI";
import ChatInput from "./ChatInput";
import "./App.css";
import mbtiDatabase from "./tools/mbti";

const mbtiDB = new mbtiDatabase();

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (message) => {
    try {
      setIsLoading(true);
      
      // 앱에 유저 메시지 넣기
      setMessages(prev => [...prev, { 
        type: 'user', 
        content: message,
        timestamp: new Date().toISOString()
      }]);

      // AI 응답
      const config = {
        thread_id: "test",
        db: mbtiDB
      };
      const result = await Invoke(message, config);
      
      // 앱에 AI 메시지 넣기
      setMessages(prev => [...prev, {
        type: 'ai',
        content: result,
        timestamp: new Date().toISOString()
      }]);

    } catch (error) {
      console.error('Error submitting message:', error);
      // Add error message to chat
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Sorry, there was an error processing your message.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 bg-gray-800 text-white">
        <h1 className="text-xl font-bold">LLMBTI</h1>
      </header>

      <main className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg max-w-3xl ${
              msg.type === 'user' 
                ? 'bg-blue-100 ml-auto' 
                : msg.type === 'error'
                ? 'bg-red-100'
                : 'bg-gray-100'
            }`}
          >
            {/* 추후에 user을 넣으면 You 대신에 사용자 이름 변수 넣기 */}
            <div className={`message ${msg.type}`}>
              <div className="message-meta">
                {msg.type === 'user' ? 'You' : 'AI'}
            </div>
            <div className="message-content">
              {msg.content}
            </div>
              <div className="timestamp">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </main>

      <footer className="p-4 border-t">
        <ChatInput 
          onSendMessage={handleSubmit}
          disabled={isLoading}
        />
        {isLoading && (
          <p className="text-sm text-gray-500 mt-2">
            Processing your message...
          </p>
        )}
      </footer>
    </div>
  );
}

export default App;
