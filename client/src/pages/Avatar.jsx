import { useEffect, useState } from "react";
import DottedFace from "../components/Simli/DottedFace";
import SimliOpenAI from "../components/Simli/SimliOpenAI";
import SimliOpenAIPushToTalk from "../components/Simli/SimliOpenAIPushToTalk";

// Customize your avatar here
const avatar = {
  name: "Frank",
  openai_voice: "echo",
  simli_faceid: "5514e24d-6086-46a3-ace4-6a7264e5cb7c",
  initialPrompt:
    "You are a helpful AI assistant named Frank. You are friendly and concise in your responses. Your task is to help users with any questions they might have. Your answers are short and to the point, don't give long answers be brief and straightforward.",
};

const Avatar = () => {
  const [showDottedFace, setShowDottedFace] = useState(true);
  const [interactionMode, setInteractionMode] = useState("regular");

  useEffect(() => {
    const storedInteractionMode = localStorage.getItem("interactionMode");
    if (storedInteractionMode) {
      setInteractionMode(storedInteractionMode);
    }
  }, []);

  const saveInteractionMode = (mode) => {
    localStorage.setItem("interactionMode", mode);
    setInteractionMode(mode);
  };

  const onStart = () => {
    console.log("Setting setshowDottedface to false...");
    setShowDottedFace(false);
  };

  const onClose = () => {
    console.log("Setting setshowDottedface to true...");
    setShowDottedFace(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center font-abc-repro font-normal text-sm text-white p-8">
      {showDottedFace && (
        <div className="absolute bottom-[32px] right-[32px] flex gap-2">
          <button
            onClick={() => saveInteractionMode("regular")}
            className={`px-4 py-2 rounded-[100px] font-abc-repro-mono focus:bg-simliblue focus:text-white focus:rounded-[100px] hover:rounded-sm hover:bg-white hover:text-black transition-all duration-300 ${
              interactionMode === "regular"
                ? "bg-simliblue"
                : "bg-white bg-opacity-20"
            }`}
          >
            <b>Regular</b>
          </button>
          <button
            onClick={() => saveInteractionMode("pushToTalk")}
            className={`px-4 py-2 rounded-[100px] font-abc-repro-mono focus:bg-simliblue focus:text-white focus:rounded-[100px] hover:rounded-sm hover:bg-white hover:text-black transition-all duration-300 ${
              interactionMode === "pushToTalk"
                ? "bg-simliblue"
                : "bg-white bg-opacity-20"
            }`}
          >
            <b>Push to Talk</b>
          </button>
        </div>
      )}
      <div className="flex flex-col items-center gap-6 bg-effect15White p-6 pb-[40px] rounded-xl w-full">
        <div>
          {showDottedFace && <DottedFace />}
          {interactionMode === "regular" ? (
            <SimliOpenAI
              openai_voice={avatar.openai_voice}
              simli_faceid={avatar.simli_faceid}
              initialPrompt={avatar.initialPrompt}
              onStart={onStart}
              onClose={onClose}
              showDottedFace={showDottedFace}
            />
          ) : (
            <SimliOpenAIPushToTalk
              openai_voice={avatar.openai_voice}
              simli_faceid={avatar.simli_faceid}
              initialPrompt={avatar.initialPrompt}
              onStart={onStart}
              onClose={onClose}
              showDottedFace={showDottedFace}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Avatar;
