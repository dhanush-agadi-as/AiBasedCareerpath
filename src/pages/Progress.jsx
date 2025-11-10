import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import PageWrapper from "../components/PageWrapper";

function Progress() {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000/api/progress";
  const token = localStorage.getItem("token");

  const fetchProgress = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProgress(res.data);
    } catch (err) {
      console.error("Error fetching progress:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompletion = async (item) => {
    try {
      await axios.post(
        API_URL,
        { itemName: item.itemName, type: item.type, completed: !item.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProgress();
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  return (
    <PageWrapper>
      <div className="flex flex-col items-center min-h-screen p-6 space-y-6">
        <Card className="p-6 w-full max-w-3xl shadow-xl bg-white dark:bg-gray-800">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 text-center mb-6">
            📊 Your Learning Progress
          </h1>

          {loading ? (
            <p className="text-center text-gray-500">Loading progress...</p>
          ) : progress.length === 0 ? (
            <p className="text-center text-gray-500">No tracked items yet.</p>
          ) : (
            <ul className="space-y-3">
              {progress.map((item) => (
                <li
                  key={item._id}
                  className={`flex justify-between items-center p-3 rounded-md ${
                    item.completed
                      ? "bg-green-100 dark:bg-green-700"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  <span>
                    {item.itemName} <small className="text-gray-500">({item.type})</small>
                  </span>
                  <Button onClick={() => toggleCompletion(item)}>
                    {item.completed ? "✅ Completed" : "Mark Complete"}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </PageWrapper>
  );
}

export default Progress;
