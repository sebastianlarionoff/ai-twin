"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState<
    Array<{ text: string; type: "user" | "bot" }>
  >([
    {
      text: "Hi! I'm Sebastian's AI assistant. Ask me about his experience, skills, or what he's looking for. 👋",
      type: "bot",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEnd = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { text: message, type: "user" }]);
    setShowSuggestions(false);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [...prev, { text: data.message, type: "bot" }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            text: data.error || "Something went wrong. Please try again.",
            type: "bot",
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble connecting. Please try again.",
          type: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "What is your background?",
    "What are you looking for?",
    "Tell me about Kyriba",
    "Technical skills?",
    "Why Paris?",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <style>{`
        .chat-container {
          max-width: 640px;
          width: 100%;
          margin: 0 auto;
          padding: 1rem 0;
        }

        .chat-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 1rem 1.25rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          margin-bottom: 1rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #dbeafe;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 15px;
          color: #0369a1;
          flex-shrink: 0;
        }

        .avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .header-info p {
          font-size: 13px;
          color: #64748b;
          margin-top: 2px;
        }

        .header-info p:first-child {
          font-weight: 500;
          font-size: 15px;
          color: #1e293b;
          margin-top: 0;
        }

        .messages {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 1rem;
          min-height: 200px;
          max-height: 500px;
          overflow-y: auto;
          padding: 0.5rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        .msg {
          max-width: 85%;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.5;
          word-wrap: break-word;
        }

        .msg.bot {
          background: #f1f5f9;
          color: #1e293b;
          align-self: flex-start;
          border: 1px solid #e2e8f0;
        }

        .msg.user {
          background: #0ea5e9;
          color: white;
          align-self: flex-end;
        }

        .msg.typing {
          color: #94a3b8;
          font-style: italic;
        }

        .suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 1rem;
        }

        .suggestion {
          font-size: 12px;
          padding: 6px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 20px;
          background: white;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s;
        }

        .suggestion:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }

        .input-row {
          display: flex;
          gap: 8px;
        }

        .input-row input {
          flex: 1;
          padding: 10px 12px;
          font-size: 14px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          background: white;
          color: #1e293b;
        }

        .input-row input:focus {
          outline: none;
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
        }

        .input-row button {
          padding: 10px 16px;
          font-size: 14px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          background: white;
          color: #1e293b;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.15s;
        }

        .input-row button:hover:not(:disabled) {
          background: #f1f5f9;
          border-color: #94a3b8;
        }

        .input-row button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      <div className="chat-container">
        <div className="chat-header">
          <div className="avatar">SL</div>
          <div className="header-info">
            <p style={{ fontWeight: 500, fontSize: 15, color: "#1e293b" }}>
              Sebastian Larionov
            </p>
            <p>AI assistant — ask me anything about Sebastian</p>
          </div>
        </div>

        <div className="messages" id="messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`msg ${msg.type}`}>
              {msg.text}
            </div>
          ))}
          {isLoading && <div className="msg bot typing">typing...</div>}
          <div ref={messagesEnd} />
        </div>

        {showSuggestions && (
          <div className="suggestions">
            {suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="suggestion"
                onClick={() => handleSendMessage(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}

        <div className="input-row">
          <input
            type="text"
            id="userInput"
            placeholder="Ask something about Sebastian..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading) {
                handleSendMessage(input);
              }
            }}
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage(input)}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
