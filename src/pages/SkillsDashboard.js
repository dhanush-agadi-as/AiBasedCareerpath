import React, { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

function SkillsDashboard() {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fetch all skills
  const fetchSkills = async () => {
    const res = await fetch("http://localhost:5000/api/skills");
    const data = await res.json();
    setSkills(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Add or update a skill
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !level) return alert("Please fill all fields");

    if (editingId) {
      // Update
      await fetch(`http://localhost:5000/api/skills/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, level }),
      });
      setEditingId(null);
    } else {
      // Add
      await fetch("http://localhost:5000/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, level }),
      });
    }

    setName("");
    setLevel("");
    fetchSkills();
  };

  // Edit skill
  const handleEdit = (skill) => {
    setEditingId(skill._id);
    setName(skill.name);
    setLevel(skill.level);
  };

  // Delete skill
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/skills/${id}`, { method: "DELETE" });
    fetchSkills();
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 space-y-6 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <Card className="p-6 w-full max-w-md bg-white dark:bg-gray-800 shadow-md">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">
          {editingId ? "Edit Skill" : "Add New Skill"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
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
          <Button type="submit" className="w-full">
            {editingId ? "Update Skill" : "Add Skill"}
          </Button>
        </form>
      </Card>

      <Card className="p-6 w-full max-w-md bg-white dark:bg-gray-800 shadow-md">
        <h2 className="text-xl font-semibold mb-3">All Skills</h2>
        <ul className="space-y-2">
          {skills.map((skill) => (
            <li
              key={skill._id}
              className="flex justify-between items-center border-b pb-1"
            >
              <div>
                <span className="font-semibold">{skill.name}</span>{" "}
                <span className="text-sm text-gray-500">({skill.level})</span>
              </div>
              <div className="space-x-2">
                <Button onClick={() => handleEdit(skill)} size="sm">
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(skill._id)}
                  size="sm"
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export default SkillsDashboard;
