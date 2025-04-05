import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Lost() {
  const [messages, setMessages] = useState([
    { from: "bot", type: "text", text: "Hi there! What item have you lost?" },
  ]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const handleSend = async () => {
    if (input.trim() === "" && !image) return;

    const userMessage = {
      from: "user",
      type: "composite",
      text: input.trim(),
      image: image,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await axios.post("/api/lost", {
        text: input.trim(),
        image: image,
      });

      // Assuming backend returns { type: 'text', text: 'response' }
      const botMessage = {
        from: "bot",
        type: res.data.type || "text",
        text: res.data.text,
        image: res.data.image || null,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          type: "text",
          text: "Oops! Something went wrong. Please try again.",
        },
      ]);
    }

    setInput("");
    setImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex justify-between items-start">
      <button
        onClick={() => navigate("/lostandfound/not-found")}
        className="h-10 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Go to Not Found
      </button>

      <div className="bg-white p-4 rounded shadow-md h-[500px] w-full max-w-md flex flex-col ml-auto">
        <div className="flex-1 overflow-y-auto mb-4 space-y-2" style={{ minHeight: 0 }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.from === "bot" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`p-2 rounded max-w-[75%] ${
                  msg.from === "bot"
                    ? "bg-gray-200 text-left"
                    : "bg-blue-500 text-white text-right"
                }`}
              >
                {msg.type === "text" && msg.text}
                {msg.type === "image" && (
                  <img src={msg.image} alt="Uploaded" className="rounded w-full h-auto" />
                )}
                {msg.type === "composite" && (
                  <div>
                    {msg.text && <p className="mb-2">{msg.text}</p>}
                    {msg.image && (
                      <img src={msg.image} alt="Uploaded" className="rounded w-full h-auto" />
                    )}
                  </div>
                )}
              </div>
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

          <input
            type="file"
            accept="image/*"
            id="file-upload"
            onChange={handleImageChange}
            className="hidden"
          />

          <label
            htmlFor="file-upload"
            className={`cursor-pointer px-3 py-2 rounded transition text-sm flex items-center justify-center ${
              image
                ? "bg-green-200 text-green-800 hover:bg-green-300"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            title={image ? "Image attached" : "Attach Image"}
          >
            {image ? "✅" : "📎"}
          </label>

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
