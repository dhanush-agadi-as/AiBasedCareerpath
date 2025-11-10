import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      {/* Spinner */}
      <motion.div
        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">
        Loading your app...
      </p>

      {/* Skeleton shimmer */}
      <div className="mt-6 w-64 space-y-3">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-5/6"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-4/6"></div>
      </div>
    </div>
  );
};

export default Loader;
