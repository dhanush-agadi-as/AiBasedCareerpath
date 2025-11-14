import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import PageWrapper from "../components/PageWrapper";

function Recommendations() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/recommendations`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching recommendations:", err);
        setLoading(false);
      });
  }, []);

  return (
    <PageWrapper>
      <div className="flex flex-col items-center min-h-screen p-6 space-y-6">
        <Card className="p-6 w-full max-w-4xl bg-white dark:bg-gray-800 shadow-xl">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 text-center mb-6">
            Personalized Career Recommendations
          </h1>

          {loading ? (
            <p className="text-center text-gray-500">Generating recommendations...</p>
          ) : !data ? (
            <p className="text-center text-red-500">No data found.</p>
          ) : (
            <div className="space-y-8">
              {/* 🎯 Career Suggestions */}
              <section>
                <h2 className="text-2xl font-semibold mb-3">Career Paths</h2>
                <ul className="list-disc list-inside space-y-2">
                  {data.careers.map((career, i) => (
                    <li key={i} className="text-gray-700 dark:text-gray-300">
                      {career}
                    </li>
                  ))}
                </ul>
              </section>

              {/* 🎥 YouTube Videos */}
              <section>
                <h2 className="text-2xl font-semibold mb-3">YouTube Videos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.videos.map((video, i) => (
                    <a
                      key={i}
                      href={video.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      🎬 {video.title}
                    </a>
                  ))}
                </div>
              </section>

              {/* 💻 LeetCode Problems */}
              <section>
                <h2 className="text-2xl font-semibold mb-3">LeetCode Practice</h2>
                <div className="space-y-2">
                  {data.leetcode.map((problem, i) => (
                    <a
                      key={i}
                      href={problem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      🧩 {problem.title}
                    </a>
                  ))}
                </div>
              </section>
            </div>
          )}

          <div className="text-center mt-6">
            <Button onClick={() => (window.location.href = "/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}

export default Recommendations;
