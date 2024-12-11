import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import Cookie from "js-cookie";
import { FiEdit, FiTrash } from "react-icons/fi";

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const user = JSON.parse(Cookie.get("userObject") || null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = () => {
    axios
      .get(`/chat/conversations/user/${user._id}`)
      .then((res) => setConversations(res.data))
      .catch((err) => console.error(err));
  };

  const loadConversation = (conversation) => {
    setSelectedConversation(conversation);
    axios
      .get(`/chat/conversations/${conversation._id}/messages`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error(err));
  };

  const renameConversation = (conversationId, newTitle) => {
    axios
      .put("/chat/conversations/rename", { conversationId, newTitle })
      .then(() => fetchConversations())
      .catch((err) => console.error(err));
  };

  const deleteConversation = (conversationId) => {
    axios
      .delete(`/chat/conversations/${conversationId}`)
      .then(() => {
        fetchConversations();
        if (selectedConversation?._id === conversationId) {
          setSelectedConversation(null);
          setMessages([]);
        }
      })
      .catch((err) => console.error(err));
  };

  const startNewConversation = () => {
    axios
      .post("/chat/conversations", { userId: user._id, title: "New Conversation" })
      .then((res) => {
        fetchConversations();
        loadConversation(res.data);
      })
      .catch((err) => console.error(err));
  };

  const sendMessage = () => {
    axios
      .post("/chat/messages", {
        conversationId: selectedConversation._id,
        sender: user._id,
        content: input,
      })
      .then((res) => {
        setMessages([...messages, res.data.userMessage, res.data.botMessage]);
        setInput("");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full lg:w-1/3 bg-white shadow-lg">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Conversations</h2>
          <button
            onClick={startNewConversation}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            New
          </button>
        </div>
        <div className="overflow-y-auto h-full">
          {conversations.map((conv) => (
            <div
              key={conv._id}
              onClick={() => loadConversation(conv)}
              className={`flex justify-between items-center px-4 py-2 cursor-pointer ${
                selectedConversation?._id === conv._id
                  ? "bg-blue-100"
                  : "hover:bg-gray-100"
              }`}
            >
              <span className="truncate flex-1">
                {conv.title.length > 20 ? `${conv.title.slice(0, 20)}...` : conv.title}
              </span>
              <div className="flex items-center gap-2">
                <FiEdit
                  className="text-gray-500 cursor-pointer hover:text-blue-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newTitle = prompt("Enter new title", conv.title);
                    if (newTitle) renameConversation(conv._id, newTitle);
                  }}
                />
                <FiTrash
                  className="text-gray-500 cursor-pointer hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm("Are you sure you want to delete this conversation?")) {
                      deleteConversation(conv._id);
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 p-4">
        {selectedConversation ? (
          <div className="flex flex-col h-full">
            <div className="h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex mb-4 ${
                    msg.sender ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 max-w-xs rounded-lg shadow-md text-sm ${
                      msg.sender
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-green-500 text-white rounded-bl-none"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Type your message..."
              />
              <button
                onClick={sendMessage}
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">Select or create a conversation to begin chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
