import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { FaUserMinus } from "react-icons/fa";
import Chaticon from "../../src/assets/icon/chatIcon.svg";

const socket = io("https://intervue-io-assignment.onrender.com");

const Chat = ({ user, participants = [], onKick }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");

  useEffect(() => {
    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off("chatMessage");
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const msg = { user, text: message };
    socket.emit("chatMessage", msg);
    setMessage("");
  };

  const toggleChat = () => setIsOpen((p) => !p);

  return (
    <div>
      {/* Fab button (hide when open if you want) */}
      {/* {isOpen && ( */}
        <button
          onClick={toggleChat}
          className="fixed bottom-4 right-4 rounded-full shadow-lg transition duration-300 ease-in-out focus:outline-none z-50"
        >
          <img src={Chaticon} alt="chat icon" className="w-15 h-15" />
        </button>
      {/* )} */}

      {/* Chat box, fixed bottom-right, no gray overlay */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-full max-w-sm z-50 mb-6">
          <div className="bg-white text-black rounded-lg shadow-xl border border-gray-200 overflow-hidden font-sora">
            {/* Header with tabs */}
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
              <div className="flex gap-4">
                <button
                  className={`text-sm font-semibold font-sora pb-1 ${
                    activeTab === "chat"
                      ? "text-black border-b-2 border-purple-500 font-sora"
                      : "text-gray-500 font-sora"
                  }`}
                  onClick={() => setActiveTab("chat")}
                >
                  Chat
                </button>
                <button
                  className={`text-sm font-semibold font-sora pb-1 ${
                    activeTab === "participants"
                      ? "text-black border-b-2 border-purple-500 font-sora"
                      : "text-gray-500 font-sora"
                  }`}
                  onClick={() => setActiveTab("participants")}
                >
                  Participants
                </button>
              </div>

              <button
                onClick={toggleChat}
                className="text-gray-600 text-xl leading-none hover:text-gray-800"
              >
                &times;
              </button>
            </div>

            {/* Body */}
            <div className="p-3 h-64 overflow-y-auto">
              {activeTab === "chat" ? (
                messages.length ? (
                  messages.map((msg, i) => (
                    <div key={i} className="mb-2">
                      <strong className="text-black">{msg.user}:</strong> {msg.text}
                    </div>
                  ))
                ) : (
                  <p className="text-[#6E6E6E] text-center py-4 font-sora ">No messages yet</p>
                )
              ) : participants.length ? (
                <ul className="space-y-2">
                  {participants.map((p, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-center p-2 rounded-lg border border-gray-100 hover:bg-gray-50"
                    >
                      <span className="text-[#373737]">{p}</span>
                      {onKick && (
                        <button
                          onClick={() => onKick(p)}
                          className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          aria-label={`Remove ${p}`}
                        >
                          <FaUserMinus className="w-4 h-4" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#6E6E6E] text-center py-4 font-sora">No participants yet</p>
              )}
            </div>

            {/* Input only for Chat tab */}
            {activeTab === "chat" && (
              <form onSubmit={handleSendMessage} className="flex p-2 border-t border-gray-200">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-grow p-2 bg-gray-100 text-black rounded-l-lg focus:outline-none"
                  placeholder="Type a message..."
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] text-white p-2 rounded-r-lg transition duration-300 ease-in-out font-sora"
                >
                  Send
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
