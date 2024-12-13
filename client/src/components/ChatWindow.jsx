import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import Cookie from "js-cookie";
import { IoSend } from "react-icons/io5"; 

const ChatWindow = ({ conversationId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const user = JSON.parse(Cookie.get("userObject") || null);

  useEffect(() => {
    fetchMessages();
  }, [conversationId]);

  const fetchMessages = () => {
    axios
      .get(`/chat/conversations/${conversationId}/messages`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error(err));
  };

  const sendMessage = () => {
    if (input.trim() === "") return;
    axios
      .post("/chat/messages", {
        conversationId,
        sender: user._id,
        content: input,
      })
      .then((res) => {
        setMessages([...messages, res.data.userMessage, res.data.botMessage]);
        setInput("");
      })
      .catch((err) => console.error(err));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-[600px] h-[500px] bg-gray-800 border rounded-lg p-4">
        {/* Chat Messages Section */}
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-4 ${msg.sender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 max-w-xs rounded-lg shadow-md text-sm ${
                  msg.sender
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-700 text-white rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input and Send Button Section */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 bg-gray-700 text-white"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all"
          >
            <IoSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
