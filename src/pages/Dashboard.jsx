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
    // ✅ Load saved data from localStorage on page load
    const saved = localStorage.getItem("recommendations");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  // ✅ Fetch user's skills on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/skills", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSkills(res.data.skills))
      .catch((err) => console.error("Error fetching skills:", err));
  }, []);

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

  // ✅ Generate new AI recommendations
  const handleGenerateRecommendations = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first!");
    setLoading(true);

    try {
      const res = await axios.get("http://localhost:5000/api/recommendations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Save new data
      setRecommendations(res.data);
      localStorage.setItem("recommendations", JSON.stringify(res.data));
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      alert("Failed to generate recommendations. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Clear saved data manually
  const handleClearRecommendations = () => {
    localStorage.removeItem("recommendations");
    setRecommendations(null);
  };

  return (
    <PageWrapper>
      <div className="flex flex-col items-center min-h-screen p-6 space-y-8">
        {/* 📊 Skill Chart Section */}
        <Card className="p-6 w-full max-w-3xl shadow-xl bg-white dark:bg-gray-800">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 text-center mb-6">
            Skill Analytics Dashboard
          </h1>

          {skills.length === 0 ? (
            <p className="text-center text-gray-500">No skills available to display.</p>
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

        {/* 🧠 Generate / Clear Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleGenerateRecommendations}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            {loading ? "Generating Recommendations..." : "Generate Career Recommendations"}
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
                {recommendations.learning_path?.map((path, i) => (
                  <div key={i} className="mt-4 border-t pt-4">
                    <h4 className="font-semibold text-blue-500">{path.topic}</h4>
                    <p className="text-sm mb-2">{path.why_important}</p>

                    {/* 🎥 YouTube Videos */}
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

                    {/* 💻 Practice Questions */}
                    <p className="font-semibold">💻 Practice Questions:</p>
                    <ul className="list-disc list-inside">
                      {path.practice_questions?.map((q, idx) => (
                        <li key={idx}>{q}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </PageWrapper>
  );
}

export default Dashboard;
