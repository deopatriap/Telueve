"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import Button from "./Button";
import Input from "./Input";
import Card from "./Card";
import { useAnimation } from "./AnimationProvider";

interface Message {
  user: string;
  text: string;
  timestamp: string;
  isAdmin?: boolean;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState("Guest");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isReducedMotion } = useAnimation();

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // If socket already exists, don't create new one
    if (socketRef.current) return;

    // Helper to parse JWT
    const parseJwt = (token: string) => {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch (e) {
        return null;
      }
    };

    // Get user from storage if available
    const storedToken = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");

    if (adminToken) {
      setUser("Admin");
    } else if (storedToken) {
      const decoded = parseJwt(storedToken);
      if (decoded && decoded.nama) {
        setUser(decoded.nama);
      } else if (decoded && decoded.email) {
        setUser(decoded.email.split('@')[0]);
      } else {
        setUser("User");
      }
    } else {
      // Generate unique Guest ID if not exist
      let guestId = sessionStorage.getItem("guestId");
      if (!guestId) {
        guestId = `Guest-${Math.floor(Math.random() * 10000)}`;
        sessionStorage.setItem("guestId", guestId);
      }
      setUser(guestId);
    }

    // Use 127.0.0.1 to avoid ambiguous localhost resolution on Windows
    const newSocket = io("http://127.0.0.1:5005", {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket"], // Force WebSocket to avoid polling errors
    }); // Backend URL

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ ChatWidget: Connected to Socket.io server (ID:", newSocket.id, ")");
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ ChatWidget: Connection Error:", err.message);
    });

    newSocket.on("disconnect", (reason) => {
      console.warn("⚠️ ChatWidget: Disconnected:", reason);
    });

    newSocket.on("message", (msg: Message) => {
      console.log("📩 ChatWidget: Received message:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      // Clean up socket on unmount
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: isReducedMotion ? "auto" : "smooth" });
    }
  }, [messages, isOpen, isReducedMotion]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const msg = {
      user,
      text: newMessage,
      isAdmin: user === "Admin"
    };

    socket.emit("sendMessage", msg);
    setNewMessage("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Window */}
      {isOpen && (
        <Card
          className="w-full max-w-sm h-96 flex flex-col shadow-2xl animate-fade-in-up origin-bottom-right"
          decorative
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4 border-b border-nier-border pb-2">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-nier-dark">Live Support</h3>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-nier-success rounded-full animate-pulse"></span>
                <span className="text-[10px] text-nier-muted uppercase">System Online</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-nier-muted hover:text-nier-dark transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto mb-4 space-y-3 pr-2 scrollbar-thin">
            {messages.length === 0 && (
              <div className="text-center text-xs text-nier-muted italic mt-10">
                Start a secure transmission...
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.user === user ? "items-end" : "items-start"}`}
              >
                <div className={`
                  max-w-[80%] p-2 rounded-sm text-xs border
                  ${msg.user === user
                    ? "bg-nier-dark text-nier-cream border-nier-dark"
                    : "bg-nier-sand/20 text-nier-dark border-nier-border"
                  }
                `}>
                  {msg.text}
                </div>
                <span className="text-[9px] text-nier-muted uppercase mt-1">
                  {msg.user} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-nier-border">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type message..."
              className="flex-grow bg-transparent border-none text-sm text-nier-dark focus:ring-0 placeholder:text-nier-muted/50"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="text-xs uppercase font-bold text-nier-dark hover:text-nier-accent disabled:opacity-50 transition-colors"
            >
              Send
            </button>
          </form>
        </Card>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300
          ${isOpen ? "bg-nier-cream text-nier-dark border border-nier-dark rotate-90" : "bg-nier-dark text-nier-cream hover:bg-nier-accent"}
        `}
      >
        {isOpen ? (
          <span className="text-xl">✕</span>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
  );
}
