"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Redirect ko false rakho taki error handle kar sako
    });

    if (!result || result.error) {
      setError("Invalid email or password");
    } else {
      router.push("/admin"); // Successfully logged in
    }
  };

  return (
    <div className="flex justify-center items-center max-w-md mx-auto h-screen py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-md rounded  py-10"
      >
        <h2 className="text-xl font-bold mb-4 font-Integral text-black">
          Admin Sign In
        </h2>
        {error && (
          <p className="text-red-500 font-Satoshi text-[15px] mb-1">{error}</p>
        )}
        <input
          type="email"
          placeholder="Admin's Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border focus:outline-none  font-Satoshi text-sm px-4 py-2 rounded-full w-full mb-6"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border focus:outline-none  font-Satoshi text-sm px-4 py-2 rounded-full w-full mb-6"
        />
        <button
          type="submit"
          className="hover:bg-black/100 font-Satoshi rounded-full tet-white bg-black/80  text-white px-4 py-2 w-full"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignInPage;
