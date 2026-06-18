import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../api/auth";
import { Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const response = await loginUser({
        email,
        password,
      });

      localStorage.setItem(
        "access_token",
        response.access_token
      );

      localStorage.setItem(
        "refresh_token",
        response.refresh_token
      );

      navigate("/chat");

    } catch (error) {
      console.error(error);

      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#212121]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-[#2a2a2a] p-8"
      >
        <h1 className="mb-6 text-center text-3xl font-bold">
          Login
        </h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full rounded-lg bg-[#303030] p-3 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full rounded-lg bg-[#303030] p-3 outline-none"
          />

          <button className="w-full rounded-lg bg-[#10a37f] p-3">
            Sign In
          </button>
        </div>
         <p className="mt-6 text-center text-zinc-400">
            Don't have an account?{" "}
            <Link
                to="/register"
                className="text-[#10a37f]"
            >
                Sign Up
            </Link>
      </p>
      </form>
     

    </div>
  );
}