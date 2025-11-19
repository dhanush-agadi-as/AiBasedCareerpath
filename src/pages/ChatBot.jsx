import React, { useState } from "react";
import axios from "axios";
import PageWrapper from "../components/PageWrapper";

function ChatBot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const API_BASE = "http://localhost:5000";

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");
    setVideos([]);

    try {
      const res = await axios.post(
        `${API_BASE}/api/chat`,
        { question },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAnswer(res.data.answer);
      setVideos(res.data.videos || []);
    } catch (err) {
      console.error("Chat error:", err);
      setAnswer("Error: Unable to fetch response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto mt-10 p-6 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-600">
          💬 AI Career Chatbot
        </h1>

        <textarea
          className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
          rows="3"
          placeholder="Ask any career / skill / learning question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button
          onClick={handleAsk}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>

        {answer && (
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h2 className="font-bold text-lg text-blue-500">Answer:</h2>
            <p className="mt-2">{answer}</p>
          </div>
        )}

        {videos.length > 0 && (
          <div>
            <h2 className="font-bold text-lg text-blue-500 mb-2">
              🎥 Suggested Videos:
            </h2>
            <ul className="list-disc list-inside space-y-2">
              {videos.map((v, i) => (
                <li key={i}>
                  <a href={v.link} target="_blank" className="text-blue-600 underline">
                    {v.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

export default ChatBot;
