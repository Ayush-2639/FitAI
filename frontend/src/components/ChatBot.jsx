import React, { useState, useEffect } from "react";
import { chatWithAI } from "../api";

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    setHistory(savedHistory);

    if (savedHistory.length > 0) {
      setActiveChatId(savedHistory[0].id);
      setChat(savedHistory[0].messages);
    }
  }, []);

  const saveHistory = (updatedHistory) => {
    localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const response = await chatWithAI(input);
    const userMsg = { user: input, bot: response };
    const newChat = [...chat, userMsg];
    setChat(newChat);

    let updatedHistory = [...history];

    if (!activeChatId) {
      const newId = Date.now();
      updatedHistory.unshift({
        id: newId,
        title: input.slice(0, 20) + "...",
        messages: newChat,
      });
      setActiveChatId(newId);
    } else {
      updatedHistory = history.map((item) =>
        item.id === activeChatId
          ? {
              ...item,
              messages: newChat,
              title:
                item.messages.length === 0
                  ? input.slice(0, 20) + "..."
                  : item.title,
            }
          : item
      );
    }

    saveHistory(updatedHistory);
    setInput("");
    setLoading(false);
  };

  const loadChat = (id) => {
    const selected = history.find((h) => h.id === id);
    setActiveChatId(id);
    setChat(selected.messages);
  };

  const startNewChat = () => {
    setActiveChatId(null);
    setChat([]);
  };

  const deleteHistoryItem = (id) => {
    const updated = history.filter((h) => h.id !== id);
    saveHistory(updated);

    if (activeChatId === id) {
      setChat([]);
      setActiveChatId(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">

      <div className="w-64 bg-gray-800 p-4 overflow-y-auto border-r border-gray-700">
        <button
          onClick={startNewChat}
          className="w-full bg-gray-900 py-2 rounded-lg mb-4 hover:bg-black"
        >
          + New Chat
        </button>

        <h2 className="text-lg font-semibold mb-2">Chat History</h2>

        {history.length === 0 && (
          <p className="text-gray-400">No history yet...</p>
        )}

        {history.map((item) => (
          <div
            key={item.id}
            className="group flex justify-between items-center bg-gray-700 p-2 rounded-lg mb-2 cursor-pointer hover:bg-gray-600"
          >
            <p
              onClick={() => loadChat(item.id)}
              className="flex-1 truncate"
            >
              {item.title}
            </p>

            <button
              onClick={() => deleteHistoryItem(item.id)}
              className="hidden group-hover:block text-red-400 hover:text-red-600 ml-2"
            >
              ❌
            </button>
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col p-6">

        <h1 className="text-2xl font-bold text-center mb-4">
          AI Chat Assistant 🤖
        </h1>

        <div className="flex-1 bg-gray-800 p-4 rounded-xl overflow-y-auto border border-gray-700">

          {chat.map((msg, i) => (
            <div key={i} className="mb-6">

              <div className="flex justify-end">
                <div className="bg-gray-600 text-white p-4 rounded-2xl max-w-xl shadow-md">
                  <p className="font-semibold text-sm mb-1 text-blue-200">You</p>
                  {msg.user}
                </div>
              </div>

              <div className="flex justify-start mt-3">
                <div className="bg-gray-700 text-gray-200 p-4 rounded-2xl max-w-xl shadow-md">
                  <p className="font-semibold text-sm mb-1 text-gray-300">
                    AI Assistant
                  </p>
                  <div dangerouslySetInnerHTML={{ __html: msg.bot }}></div>
                </div>
              </div>

            </div>
          ))}

          {loading && <p className="text-blue-400">Generating response…</p>}
        </div>

        <div className="flex mt-4 gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            className="flex-1 bg-gray-800 p-3 rounded-xl border border-gray-700 focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 px-6 rounded-xl hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
