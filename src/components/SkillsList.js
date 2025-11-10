import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

function SkillsList() {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");

  // Fetch skills from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/skills")
      .then((res) => res.json())
      .then((data) => setSkills(data))
      .catch((err) => console.error("Error fetching skills:", err));
  }, []);

  // Add new skill
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!name || !level) return alert("Please fill all fields");

    const response = await fetch("http://localhost:5000/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, level }),
    });

    if (response.ok) {
      const data = await response.json();
      setSkills([...skills, data.skill]);
      setName("");
      setLevel("");
    } else {
      alert("Error adding skill");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6">
      <Card className="p-6 w-full max-w-md bg-white shadow-md">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">Add a New Skill</h2>
        <form onSubmit={handleAddSkill} className="space-y-3">
          <Input
            placeholder="Skill Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Skill Level (Beginner, Intermediate, Advanced)"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          />
          <Button type="submit" className="w-full">Add Skill</Button>
        </form>
      </Card>

      <Card className="p-6 w-full max-w-md bg-white shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Existing Skills</h2>
        <ul className="space-y-2">
          {skills.map((skill) => (
            <li key={skill._id} className="flex justify-between border-b pb-1">
              <span>{skill.name}</span>
              <span className="text-sm text-gray-500">{skill.level}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export default SkillsList;
