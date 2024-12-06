import { useState } from "react";

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-300 rounded-lg mb-4 overflow-hidden">
      <button
        className="w-full px-4 py-3 text-left font-semibold text-black bg-gray-200 hover:bg-gray-300 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <span
          className={`float-right transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          ▼
        </span>
      </button>
      {isOpen && <div className="px-4 py-3 bg-gray-100">{children}</div>}
    </div>
  );
};

export default Accordion;
