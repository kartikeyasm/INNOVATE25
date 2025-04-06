import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Lost() {
  const [messages, setMessages] = useState([
    { from: "bot", type: "text", text: "Greetings! How can I assist you?" },
  ]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const chatContainerRef = useRef(null);
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
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 flex justify-center items-center px-4 py-10">
      <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-lg flex flex-col">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Report Lost Item
        </h2>

        <div
          ref={chatContainerRef}
          className="mb-4 space-y-3 border border-gray-200 rounded-xl p-4 h-[400px] overflow-y-auto bg-gray-50"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.from === "bot" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[75%] text-sm shadow ${
                  msg.from === "bot"
                    ? "bg-gray-200 text-gray-800"
                    : "bg-indigo-600 text-white"
                }`}
              >
                {msg.type === "text" && msg.text}
                {msg.type === "image" && (
                  <img
                    src={msg.image}
                    alt="Uploaded"
                    className="rounded mt-2 w-48 h-auto"
                  />
                )}
                {msg.type === "composite" && (
                  <div>
                    {msg.text && <p className="mb-2">{msg.text}</p>}
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Uploaded"
                        className="rounded w-48 h-auto"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
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
            className={`cursor-pointer px-3 py-2 rounded-xl text-sm font-medium transition ${
              image
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            title={image ? "Image attached" : "Attach Image"}
          >
            {image ? "✅" : "📎"}
          </label>

          <button
            onClick={handleSend}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}