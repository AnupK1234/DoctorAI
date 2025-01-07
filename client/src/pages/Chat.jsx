import Cookie from "js-cookie";
import React, { useEffect, useState } from "react";
import { FiEdit, FiFile, FiImage, FiSend, FiTrash } from "react-icons/fi";
import axios from "../utils/axiosInstance";

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const user = JSON.parse(Cookie.get("userObject") || null);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, [selectedConversation]);

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
      .post("/chat/conversations", { userId: user._id })
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
        const newMessages = [
          ...messages,
          res.data.userMessage,
          res.data.botMessage,
        ];
        setMessages(newMessages);

        // Add prompt and buttons after the first chatbot message
        // if (newMessages.length === 2) {
        //   setMessages((prev) => [
        //     ...prev,
        //     {
        //       sender: null,
        //       content: "Would you like to create a Node?",
        //       options: true, // Indicate this message has buttons
        //     },
        //   ]);
        // }
  
        const timeOut = setTimeout(() => loadConversation(selectedConversation), 5000);

        if (res.data.conversationTitle !== "Untitled Conversation") {
          setSelectedConversation((selectedConversation) => ({
            ...selectedConversation,
            title: res.data.conversationTitle,
          }));
        }
        setInput("");
      })
      .catch((err) => console.error(err));
  };

  const handleButtonClick = (response) => {
    if (response === "yes") {
      setMessages((prev) => [
        ...prev,
        {
          sender: null,
          content: (
            <>
              Link to the node:{" "}
              <a
                href="https://abcd.com/createNode"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                https://abcd.com/createNode
              </a>
            </>
          ),
        },
      ]);
    }
    setShowButtons((state) => !state);
    // No need to do anything for "No"
  };

  const handleFileUpload = async (type) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = type === "image" ? "image/*" : "application/pdf";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      const formData = new FormData();
      formData.append("file", file);
      formData.append("conversationId", selectedConversation._id);
      formData.append("sender", user._id);
      formData.append("content", `Uploaded ${type}: ${file.name}`);

      try {
        const response = await axios.post(
          `/chat/${type === "image" ? "img-analysis" : "pdf-analysis"}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log("REs : ", response);
        // Update messages in the chat with the response
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: user._id,
            content: `Uploaded ${type}: ${file.name}`,
          },
          {
            sender: null,
            content: response.data.content, // Response from the backend AI
          },
        ]);
      } catch (error) {
        console.error("File upload failed:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: null,
            content: `Error processing ${type}. Please try again.`,
          },
        ]);
      }
    };
  
    fileInput.click();
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
                {conv.title.length > 20 ? `${conv.title}...` : conv.title}
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
                    if (
                      window.confirm(
                        "Are you sure you want to delete this conversation?"
                      )
                    ) {
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
                  className={`flex flex-col mb-4 ${
                    msg.sender ? "items-end" : "items-start"
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
                  {!showButtons && msg.options && (
                    <div className="flex gap-4 mt-2">
                      <button
                        onClick={() => handleButtonClick("yes")}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => handleButtonClick("no")}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        No
                      </button>
                    </div>
                  )}
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
              <div className="flex gap-2">
                {/* Send button */}
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center"
                >
                  <FiSend className="mr-1" /> Send
                </button>

                {/* Image analysis button */}
                <button
                  onClick={() => handleFileUpload("image")}
                  className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center"
                >
                  <FiImage />
                </button>

                {/* PDF analysis button */}
                <button
                  onClick={() => handleFileUpload("pdf")}
                  className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all flex items-center"
                >
                  <FiFile />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">
              Select or create a conversation to begin chatting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
