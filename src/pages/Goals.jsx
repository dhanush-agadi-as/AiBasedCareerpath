// ==================== Goals.jsx ====================
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

function Goals() {
  const [goals, setGoals] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetDate: "",
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api`,
    headers: { Authorization: `Bearer ${token}` },
  });

  // ✅ Fetch all goals
  const fetchGoals = async () => {
    try {
      const res = await api.get("/goals");
      setGoals(res.data);
    } catch (err) {
      console.error("Error fetching goals:", err);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Add goal
  const handleAddGoal = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/goals", formData);
      setFormData({ title: "", description: "", targetDate: "" });
      fetchGoals();
    } catch (err) {
      console.error("Error adding goal:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle completion
  const toggleCompleted = async (goal) => {
    try {
      await api.put(`/goals/${goal._id}`, {
        ...goal,
        completed: !goal.completed,
      });
      fetchGoals();
    } catch (err) {
      console.error("Error updating goal:", err);
    }
  };

  // ✅ Delete goal
  const deleteGoal = async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      fetchGoals();
    } catch (err) {
      console.error("Error deleting goal:", err);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      <Card className="p-8 w-full max-w-3xl bg-white dark:bg-gray-800 shadow-xl">
        <h2 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">
          🎯 My Learning Goals
        </h2>

        {/* Add Goal Form */}
        <form onSubmit={handleAddGoal} className="space-y-4 mb-8">
          <Input
            type="text"
            name="title"
            placeholder="Goal Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="description"
            placeholder="Short Description"
            value={formData.description}
            onChange={handleChange}
          />
          <Input
            type="date"
            name="targetDate"
            value={formData.targetDate}
            onChange={handleChange}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Adding..." : "Add Goal"}
          </Button>
        </form>

        {/* Display Goals */}
        <div className="space-y-4">
          {goals.length === 0 ? (
            <p className="text-center text-gray-500">No goals yet. Add one!</p>
          ) : (
            goals.map((goal) => (
              <Card
                key={goal._id}
                className={`p-4 border ${
                  goal.completed ? "border-green-500" : "border-gray-300"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3
                      className={`text-lg font-semibold ${
                        goal.completed ? "line-through text-green-600" : ""
                      }`}
                    >
                      {goal.title}
                    </h3>
                    <p className="text-sm text-gray-500">{goal.description}</p>
                    {goal.targetDate && (
                      <p className="text-xs text-gray-400">
                        Target: {new Date(goal.targetDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCompleted(goal)}
                    >
                      {goal.completed ? "Undo" : "Complete"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteGoal(goal._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

export default Goals;
