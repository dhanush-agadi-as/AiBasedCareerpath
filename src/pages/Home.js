// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import PageWrapper from "../components/PageWrapper";
import { motion } from "framer-motion";

function Home() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState({ name: "", level: "" });
  const [editSkill, setEditSkill] = useState(null);

  const API_URL = "http://localhost:5000/api/skills";
  const token = localStorage.getItem("token");

  // ✅ Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // ✅ Fetch skills (only if logged in)
  const fetchSkills = async () => {
    if (!token) return;
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSkills(res.data.skills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      if (error.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // ✅ Add Skill
  const handleAddSkill = async () => {
    if (!newSkill.name || !newSkill.level)
      return alert("Please fill all fields!");

    try {
      await axios.post(API_URL, newSkill, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewSkill({ name: "", level: "" });
      fetchSkills();
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  };

  // ✅ Update Skill
  const handleUpdateSkill = async () => {
    if (!editSkill.name || !editSkill.level)
      return alert("Both fields required!");
    try {
      await axios.put(`${API_URL}/${editSkill._id}`, editSkill, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditSkill(null);
      fetchSkills();
    } catch (error) {
      console.error("Error updating skill:", error);
    }
  };

  // ✅ Delete Skill
  const handleDeleteSkill = async (id) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchSkills();
      } catch (error) {
        console.error("Error deleting skill:", error);
      }
    }
  };

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen space-y-6 p-6">
        <Card className="p-6 shadow-xl bg-white dark:bg-gray-800 text-center">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-3">
            Welcome to CareerPath AI 🚀
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Manage your learning skills securely.
          </p>

          {/* ✅ Add Skill Form */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-center">
            <Input
              placeholder="Skill Name"
              value={newSkill.name}
              onChange={(e) =>
                setNewSkill({ ...newSkill, name: e.target.value })
              }
              className="w-52"
            />
            <Input
              placeholder="Level (e.g. Beginner)"
              value={newSkill.level}
              onChange={(e) =>
                setNewSkill({ ...newSkill, level: e.target.value })
              }
              className="w-52"
            />
            <Button onClick={handleAddSkill}>Add Skill</Button>
          </div>
        </Card>

        {/* ✅ Skills List */}
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-semibold text-center mt-8 mb-4">
            Your Skills
          </h2>

          {loading ? (
            <p className="text-center text-gray-500">Loading skills...</p>
          ) : skills.length === 0 ? (
            <p className="text-center text-gray-500">No skills found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((skill) => (
                <motion.div
                  key={skill._id}
                  className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow hover:scale-105 transition-transform"
                  whileHover={{ scale: 1.05 }}
                >
                  {editSkill && editSkill._id === skill._id ? (
                    <div className="space-y-2">
                      <Input
                        value={editSkill.name}
                        onChange={(e) =>
                          setEditSkill({ ...editSkill, name: e.target.value })
                        }
                      />
                      <Input
                        value={editSkill.level}
                        onChange={(e) =>
                          setEditSkill({ ...editSkill, level: e.target.value })
                        }
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleUpdateSkill}>Save</Button>
                        <Button
                          variant="destructive"
                          onClick={() => setEditSkill(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-bold text-blue-600 dark:text-blue-300">
                        {skill.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Level: {skill.level}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="outline"
                          onClick={() => setEditSkill(skill)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteSkill(skill._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

export default Home;
