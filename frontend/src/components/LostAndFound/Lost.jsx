import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Lost() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi there! What item have you lost?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const handleSend = () => {
    if (input.trim() === "") return;

    const newMessages = [
      ...messages,
      { from: "user", text: input },
      { from: "bot", text: "Thanks! We'll check if it's been found." },
    ];
    setMessages(newMessages);
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex justify-between items-start">
      {/* Left Button */}
      <button
        onClick={() => navigate("/lostandfound/not-found")}
        className="h-10 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Go to Not Found
      </button>

      {/* Chat Box on Right */}
      <div className="bg-white p-4 rounded shadow-md h-[500px] w-full max-w-md flex flex-col ml-auto">
        <div className="flex-1 overflow-y-auto flex flex-col justify-end mb-4 space-y-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded max-w-[75%] ${
                msg.from === "bot"
                  ? "bg-gray-200 text-left"
                  : "bg-blue-500 text-white self-end text-right"
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Describe your lost item..."
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
