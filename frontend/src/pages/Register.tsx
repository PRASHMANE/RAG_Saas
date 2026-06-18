import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../api/auth";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await registerUser({
        full_name: fullName,
        email,
        password,
      });

      navigate("/");

    } catch (error) {
      console.error(error);

      alert("Registration failed");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#212121]">
      <div className="w-full max-w-md rounded-2xl bg-[#2a2a2a] p-8">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Create Account
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
            className="w-full rounded-lg bg-[#303030] p-3 outline-none"
          />

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
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-zinc-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#10a37f]"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}