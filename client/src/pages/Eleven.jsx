import React, { useState } from "react";
import ChatWindow from "../components/ChatWindow";
import Avatar3 from "../components/ElevenLab_Simli/Avatar3";
import axios from "../utils/axiosInstance";
import Cookie from "js-cookie";

const Eleven = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const user = JSON.parse(Cookie.get("userObject") || null);
  const [conversationId, setConversationId] = useState(null);

  const startNewConversation = () => {
    axios
      .post("/chat/conversations", { userId: user._id, title: "New Conversation" })
      .then((res) => {
        setConversationId(res.data._id);
        setActiveComponent("chat");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      {/* Button Container */}
      <div
        className={`absolute ${
          activeComponent ? "top-4 left-4" : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        } flex items-center gap-4 transition-all duration-300`}
      >
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
          onClick={startNewConversation}
        >
          Chat
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
          onClick={() => setActiveComponent("avatar")}
        >
          Avatar
        </button>
      </div>

      {/* Active Component */}
      <div className="pt-20">
        {activeComponent === "chat" && conversationId && (
          <ChatWindow conversationId={conversationId} />
        )}
        {activeComponent === "avatar" && <Avatar3 />}
      </div>
    </div>
  );
};

export default Eleven;
