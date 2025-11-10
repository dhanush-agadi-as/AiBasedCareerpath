import React, { useEffect, useState } from "react";

function Skills() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/skills")
      .then((res) => res.json())
      .then((data) => setSkills(data.skills))
      .catch((err) => console.error("Error fetching skills:", err));
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-600 mb-4">Skills from Backend</h2>
      <ul className="space-y-3">
        {skills.map((skill) => (
          <li
            key={skill.id}
            className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition"
          >
            <span>{skill.name}</span>
            <span className="text-sm text-gray-500">{skill.level}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Skills;
