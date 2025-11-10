import React from "react";
import { Card } from "../components/ui/card";
import PageWrapper from "../components/PageWrapper";

function About() {
  return (
    <PageWrapper>
      <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg text-center">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
          About CareerPath AI
        </h1>
        <p className="text-gray-700 dark:text-gray-300">
          CareerPath AI helps learners discover the best learning paths, skill
          resources, and job-ready content based on their goals.
        </p>
      </Card>
    </PageWrapper>
  );
}

export default About;
