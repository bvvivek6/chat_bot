import React, { useState } from "react";
import ChatBotIcon from "./components/ChatBotIcon";
import ChatForm from "./components/ChatForm";
import Chatmsg from "./components/Chatmsg";

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);

  const generateBotResponse = async (history) => {
    const formattedHistory = history.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    const API_KEY = import.meta.env.VITE_API_URL;
    if (!API_KEY) {
      console.error("API URL is missing. Check your .env file.");
      return "Error: API URL missing";
    }

    try {
      const response = await fetch(API_KEY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: formattedHistory }),
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const data = await response.json();
      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text.trim() || "No response"
      );
    } catch (error) {
      console.error("Error fetching response:", error);
      return "Sorry, I couldn't process your request.";
    }
  };

  return (
    <div className="container">
      <div className="chat-bot-popup">
        <div className="chat-header">
          <div className="header-info">
            <ChatBotIcon />
            <h2 className="logo-text">Chat Bot</h2>
          </div>
        </div>
        <div className="chat-body">
          <div className="msg bot-msg">
            <ChatBotIcon />
            <p className="msg-text">Hello there!!🙋‍♂️</p>
          </div>
          {chatHistory.map((chat, index) => (
            <Chatmsg key={index} chat={chat} />
          ))}
        </div>
        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
