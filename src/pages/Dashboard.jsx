import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import PageWrapper from "../components/PageWrapper";

function Dashboard() {
  const [skills, setSkills] = useState([]);
  const [recommendations, setRecommendations] = useState(() => {
    const saved = localStorage.getItem("recommendations");
    return saved ? JSON.parse(saved) : null;
  });
  const [completedTopics, setCompletedTopics] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const API_BASE = "http://localhost:5000";

  // ✅ Fetch user's skills + completed topics from DB
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const [skillsRes, progressRes] = await Promise.all([
          axios.get(`${API_BASE}/api/skills`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE}/api/progress`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setSkills(skillsRes.data.skills);

        const completed = (progressRes.data || [])
          .filter((p) => p.completed)
          .map((p) => p.topic);
        setCompletedTopics(completed);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [token]);

  // ✅ Skill level mapping
  const getLevelValue = (level) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return 30;
      case "intermediate":
        return 60;
      case "advanced":
        return 90;
      default:
        return 0;
    }
  };

  const chartData = skills.map((skill) => ({
    name: skill.name,
    value: getLevelValue(skill.level),
  }));

  // ✅ Generate AI recommendations
  const handleGenerateRecommendations = async () => {
    if (!token) return alert("Please login first!");
    setLoading(true);

    try {
      const res = await axios.get("http://localhost:5000/api/recommendations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRecommendations(res.data);
      localStorage.setItem("recommendations", JSON.stringify(res.data));
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      alert("Failed to generate recommendations. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Clear saved data
  const handleClearRecommendations = () => {
    localStorage.removeItem("recommendations");
    setRecommendations(null);
  };

  // ✅ Mark topic as completed (Save to DB)
  const handleMarkCompleted = async (topic) => {
    if (completedTopics.includes(topic)) return;

    try {
      await axios.put(
        `${API_BASE}/api/progress/${encodeURIComponent(topic)}`,
        { completed: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = [...completedTopics, topic];
      setCompletedTopics(updated);
    } catch (err) {
      console.error("Error marking topic completed:", err);
      alert("Failed to save progress to database.");
    }
  };

  // ✅ Undo completed (Remove from DB)
  const handleUndoCompleted = async (topic) => {
    try {
      await axios.put(
        `${API_BASE}/api/progress/${encodeURIComponent(topic)}`,
        { completed: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = completedTopics.filter((t) => t !== topic);
      setCompletedTopics(updated);
    } catch (err) {
      console.error("Error removing completed topic:", err);
      alert("Failed to update progress in database.");
    }
  };

  // ✅ Calculate progress %
  const calculateProgress = () => {
    if (!recommendations?.learning_path?.length) return 0;
    const total = recommendations.learning_path.length;
    const done = recommendations.learning_path.filter((item) =>
      completedTopics.includes(item.topic)
    ).length;
    return Math.round((done / total) * 100);
  };

  const progressPercent = calculateProgress();

  return (
    <PageWrapper>
      <div className="flex flex-col items-center min-h-screen p-6 space-y-8">
        {/* 📊 Skill Chart Section */}
        <Card className="p-6 w-full max-w-3xl shadow-xl bg-white dark:bg-gray-800">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 text-center mb-6">
            Skill Analytics Dashboard
          </h1>

          {skills.length === 0 ? (
            <p className="text-center text-gray-500">
              No skills available to display.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* 📈 Learning Progress Bar */}
        {recommendations && (
          <Card className="p-4 w-full max-w-3xl shadow-md bg-white dark:bg-gray-800">
            <h2 className="text-lg font-semibold mb-2 text-blue-600">
              Overall Learning Progress
            </h2>
            <div className="w-full bg-gray-200 h-5 rounded-full overflow-hidden">
              <div
                className="bg-green-500 h-5 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="mt-2 text-gray-600 text-center font-medium">
              {progressPercent}% completed
            </p>
          </Card>
        )}

        {/* 🧠 Generate / Clear Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleGenerateRecommendations}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            {loading
              ? "Generating Recommendations..."
              : "Generate Career Recommendations"}
          </Button>

          {recommendations && (
            <Button
              onClick={handleClearRecommendations}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg"
            >
              Clear Saved Recommendations
            </Button>
          )}
        </div>

        {/* 🎯 Display AI Recommendations */}
        {recommendations && (
          <Card className="p-6 w-full max-w-3xl mt-4 bg-white dark:bg-gray-800 shadow-xl">
            <h2 className="text-2xl font-semibold text-blue-500 mb-4 text-center">
              🎯 AI Career Recommendations
            </h2>

            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              {/* ✅ Career Paths */}
              <div>
                <h3 className="font-bold text-lg text-blue-600">Career Paths:</h3>
                <ul className="list-disc list-inside">
                  {recommendations.careers?.map((career, i) => (
                    <li key={i}>{career}</li>
                  ))}
                </ul>
              </div>

              {/* ✅ Learning Path */}
              <div>
                <h3 className="font-bold text-lg text-blue-600">Learning Path:</h3>
                {recommendations.learning_path?.map((path, i) => {
                  const isCompleted = completedTopics.includes(path.topic);
                  return (
                    <div
                      key={i}
                      className={`mt-4 border-t pt-4 rounded-lg p-4 ${
                        isCompleted
                          ? "bg-green-100 dark:bg-green-900"
                          : "bg-gray-50 dark:bg-gray-700"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <h4
                          className={`font-semibold ${
                            isCompleted ? "text-green-600" : "text-blue-500"
                          }`}
                        >
                          {path.topic}
                        </h4>

                        {isCompleted ? (
                          <Button
                            onClick={() => handleUndoCompleted(path.topic)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 text-sm"
                          >
                            Undo
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleMarkCompleted(path.topic)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm"
                          >
                            Mark as Completed
                          </Button>
                        )}
                      </div>

                      <p className="text-sm mb-2 mt-2">{path.why_important}</p>

                      <p className="font-semibold">🎥 YouTube Videos:</p>
                      <ul className="list-disc list-inside mb-2">
                        {path.videos?.length ? (
                          path.videos.map((v, idx) => (
                            <li key={idx}>
                              <a
                                href={v.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                {v.title}
                              </a>
                            </li>
                          ))
                        ) : (
                          <li>No videos found</li>
                        )}
                      </ul>

                      <p className="font-semibold">💻 Practice Questions:</p>
                      <ul className="list-disc list-inside">
                        {path.practice_questions?.map((q, idx) => (
                          <li key={idx}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        )}

        {/* ✅ Completed Topics Section */}
        {completedTopics.length > 0 && (
          <Card className="p-6 w-full max-w-3xl mt-6 bg-green-50 dark:bg-gray-800 shadow-xl">
            <h3 className="text-2xl font-semibold text-green-600 mb-4 text-center">
              ✅ Completed Topics
            </h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              {completedTopics.map((topic, i) => (
                <li key={i}>{topic}</li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </PageWrapper>
  );
}

export default Dashboard;
