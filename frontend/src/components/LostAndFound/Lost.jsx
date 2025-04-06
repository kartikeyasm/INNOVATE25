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
      const response = await axios.post("http://127.0.0.1:5000/upload", {
        text: input.trim(),
        image: image, // This will be the base64 string
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const botMessage = {
        from: "bot",
        type: "results",
        text: `Found ${response.data.results.length} matching results`,
        results: response.data.results
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
    <div className="min-h-screen flex justify-center  px-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg flex flex-col">
        <div
          ref={chatContainerRef}
          className="mb-4 space-y-3 border border-gray-200 rounded-lg p-3 h-[400px] overflow-y-auto"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.from === "bot" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`p-3 rounded-xl max-w-[75%] text-sm shadow-sm ${
                  msg.from === "bot"
                    ? "bg-gray-100 text-gray-900"
                    : "bg-blue-600 text-white"
                }`}
              >
                {msg.type === "text" && msg.text}
                {msg.type === "image" && (
                  <img
                    src={msg.image}
                    alt="Uploaded"
                    className="rounded w-48 h-auto mt-2"
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

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
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
            className={`cursor-pointer px-3 py-2 rounded-xl text-sm transition ${
              image
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            title={image ? "Image attached" : "Attach Image"}
          >
            {image ? "✅" : "📎"}
          </label>

          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
