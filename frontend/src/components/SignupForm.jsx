import { useState } from "react";
import { Label, TextInput, Button, Card } from "flowbite-react";
import { Link } from "react-router-dom";
import axios from "axios";


export default function SignupForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/signup", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
  
      console.log("Signup successful:", response.data);
      alert("Signup successful!");
      // Optionally, redirect the user to login or dashboard
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      <Card className="w-full max-w-md bg-gray-800 bg-opacity-80 backdrop-blur-md">
        <h2 className="text-2xl text-white font-bold text-center mb-4 capitalize">
          Sign Up
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <div className="w-1/2">
              <Label htmlFor="firstName" value="First Name" className="text-white mb-1" />
              <TextInput
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                placeholder="First Name"
              />
            </div>
            <div className="w-1/2">
              <Label htmlFor="lastName" value="Last Name" className="text-white mb-1" />
              <TextInput
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                placeholder="Last Name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" value="Email address" className="text-white mb-1" />
            <TextInput
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div>
            <Label htmlFor="password" value="Password" className="text-white mb-1" />
            <TextInput
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" value="Confirm Password" className="text-white mb-1" />
            <TextInput
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter password"
            />
          </div>

          <Button type="submit" className="mt-2">
            Sign Up
          </Button>

          <div className="text-center text-sm text-white mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:underline">
              Login
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
