import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaRobot, FaTimes } from "react-icons/fa";
import "./ChatBot.scss";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatBodyRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/chatbot/ask", { question: input });
      const botMessage = { sender: "bot", text: res.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSampleClick = async (sampleQuestion) => {
    const userMessage = { sender: "user", text: sampleQuestion };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await axios.post("/chatbot/ask", {
        question: sampleQuestion,
      });
      const botMessage = { sender: "bot", text: res.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <span>
              <FaRobot /> AI Assistant
            </span>
            <FaTimes className="close-btn" onClick={() => setIsOpen(false)} />
          </div>
          <div className="chatbot-body" ref={chatBodyRef}>
            <div className="sample-questions">
              <p>Try asking:</p>
              <ul>
                <li
                  onClick={() =>
                    handleSampleClick("What does Astakenis offer?")
                  }
                >
                  What does Astakenis offer?
                </li>
                <li
                  onClick={() => handleSampleClick("How is my data secured?")}
                >
                  How is my data secured?
                </li>
                <li onClick={() => handleSampleClick("Can I delete my data?")}>
                  Can I delete my data?
                </li>
                <li
                  onClick={() =>
                    handleSampleClick(
                      "How does Astakenis help pharma companies?"
                    )
                  }
                >
                  How does Astakenis help pharma companies?
                </li>
              </ul>
            </div>
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.sender}`}>
                <div className="message-text">{msg.text}</div>
              </div>
            ))}
            {loading && <div className="chat-message bot">Typing...</div>}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}

      <div className="chatbot-icon" onClick={() => setIsOpen(true)}>
        <FaRobot size={24} />
      </div>
    </>
  );
};

export default ChatBot;
