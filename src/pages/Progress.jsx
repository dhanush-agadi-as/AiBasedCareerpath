import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ProgressBar } from "../components/ui/progress"; // make sure this exists
import PageWrapper from "../components/PageWrapper";

function ProgressPage() {
  const [progressItems, setProgressItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000/api/progress";

  // ✅ Fetch progress from backend
  const fetchProgress = async () => {
    try {
      const res = await axios.get(API_URL);
      const items = Array.isArray(res.data.progress)
        ? res.data.progress
        : res.data;
      setProgressItems(items);
    } catch (err) {
      console.error("Error fetching progress:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Calculate completion %
  const completionRate =
    progressItems.length === 0
      ? 0
      : Math.round(
          (progressItems.filter((item) => item.completed === true).length /
            progressItems.length) *
            100
        );

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
          ) : progressItems.length === 0 ? (
            <p className="text-center text-gray-500">No tracked topics yet.</p>
          ) : (
            <>
              <div className="mb-4">
                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Overall Progress: {completionRate}%
                </p>
                <ProgressBar value={completionRate} />
              </div>

              <ul className="space-y-3">
                {progressItems.map((item) => (
                  <li
                    key={item._id}
                    className={`flex justify-between items-center p-3 rounded-md ${
                      item.completed
                        ? "bg-green-100 dark:bg-green-700"
                        : "bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    <span>{item.topic}</span>
                    <Button
                      onClick={async () => {
                        await axios.post(`${API_URL}/update`, {
                          title: item.topic,
                          completed: !item.completed,
                        });
                        fetchProgress();
                      }}
                    >
                      {item.completed ? "✅ Completed" : "Mark Complete"}
                    </Button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
      </div>
    </PageWrapper>
  );
}

export default ProgressPage;
