import React from "react";

export function ProgressBar({ value }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
      <div
        className="bg-blue-600 h-4 rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
}
