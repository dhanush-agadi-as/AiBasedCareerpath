import React, { useEffect, useState } from "react";
import axios from "axios";

function LearningPath() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all goals from backend
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/goals", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGoals(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching goals:", err);
        setGoals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  if (loading)
    return <p className="text-gray-500 text-center mt-10">Loading your learning path...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md mt-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400 text-center">
        🎯 My Learning Path
      </h1>

      {/* ✅ If goals exist, show them */}
      {goals.length > 0 ? (
        <div className="space-y-4">
          {goals.map((goal) => (
            <div
              key={goal._id}
              className={`p-5 rounded-xl border ${
                goal.completed ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-gray-300"
              }`}
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {goal.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {goal.description || "No description provided"}
              </p>
              {goal.targetDate && (
                <p className="text-sm text-gray-400 mt-2">
                  🎯 Target: {new Date(goal.targetDate).toLocaleDateString()}
                </p>
              )}
              <p
                className={`mt-2 text-sm font-semibold ${
                  goal.completed ? "text-green-600" : "text-yellow-600"
                }`}
              >
                {goal.completed ? "✅ Completed" : "🕒 In Progress"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">
          No goals set yet. Go to{" "}
          <a href="/goals" className="text-blue-600 underline">
            Goals
          </a>{" "}
          to add one.
        </p>
      )}

      {/* ✅ Optional link to add/edit goals */}
      <div className="text-center mt-8">
        <a
          href="/goals"
          className="text-blue-600 hover:underline dark:text-blue-400 font-medium"
        >
          ➕ Add or Update My Goals
        </a>
      </div>
    </div>
  );
}

export default LearningPath;
