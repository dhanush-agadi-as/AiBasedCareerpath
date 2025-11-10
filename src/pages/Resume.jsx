import React, { useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import PageWrapper from "../components/PageWrapper";

function Resume() {
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);

  const generateResume = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/resume", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResume(res.data.resume);
    } catch (error) {
      console.error("Error generating resume:", error);
      setResume("Failed to generate resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="flex flex-col items-center p-6 space-y-6 min-h-screen">
        <Card className="p-8 w-full max-w-3xl shadow-xl bg-white dark:bg-gray-800">
          <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">
            AI Resume Generator
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
            Click the button below to generate a personalized resume based on your skills.
          </p>

          <Button onClick={generateResume} disabled={loading} className="w-full">
            {loading ? "Generating..." : "Generate Resume"}
          </Button>

          {resume && (
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg whitespace-pre-line">
              {resume}
            </div>
          )}
        </Card>
      </div>
    </PageWrapper>
  );
}

export default Resume;
