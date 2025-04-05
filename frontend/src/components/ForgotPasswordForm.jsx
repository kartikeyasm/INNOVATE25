import { useState } from "react";
import { Label, TextInput, Button, Card } from "flowbite-react";
import { Link } from "react-router-dom";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sending password reset to:", email);
    alert("Password reset link sent to your email.");
    // Optionally redirect user here using useNavigate() if needed
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
          Reset Password
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <Label
              htmlFor="email"
              value="Email address"
              className="text-white mb-1"
            />
            <TextInput
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <Button type="submit">Send Reset Link</Button>

          <div className="text-center text-white text-sm mt-2">
            <Link to="/login" className="text-blue-400 hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
