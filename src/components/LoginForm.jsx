import { useState } from "react";
import { Label, TextInput, Button, Card } from "flowbite-react";
import { Link } from "react-router-dom";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with", form);
    // Add backend call
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
        <h2 className="text-2xl text-white font-bold text-center mb-4">
          Login
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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

          <Button type="submit" className="mt-2">
            Login
          </Button>

          <div className="flex justify-between text-sm text-white">
            <Link to="/forgot-password" className="text-blue-400 hover:underline">
              Forgot Password?
            </Link>
            <Link to="/signup" className="text-blue-400 hover:underline">
              Sign Up
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
