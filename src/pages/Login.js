import React, { useState } from "react";
import axios from "axios";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Alert } from "../components/ui/alert";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      setMessage(res.data.message);
      localStorage.setItem("token", res.data.token); // ✅ Save token for future requests
    } catch (error) {
      setMessage(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="p-6 w-96 space-y-4">
        <h2 className="text-2xl font-bold text-blue-600">Login</h2>
        <Input name="email" placeholder="Email" onChange={handleChange} />
        <Input name="password" placeholder="Password" type="password" onChange={handleChange} />
        <Button onClick={handleSubmit}>Login</Button>
        {message && <Alert>{message}</Alert>}
      </Card>
    </div>
  );
}

export default Login;
