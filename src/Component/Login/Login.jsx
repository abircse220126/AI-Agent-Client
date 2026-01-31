import React from "react";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-black border border-neutral-800 rounded-2xl p-8
        shadow-[0_0_40px_rgba(0,255,255,0.05)]">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-wide">
          Welcome Back
        </h2>
        <p className="text-center text-neutral-400 mb-6 text-sm">
          Login to your AI WebBuilder dashboard
        </p>

        <form className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-neutral-400 mb-1 text-sm">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@aiwebbuilder.com"
              className="w-full px-4 py-2 bg-black text-white border border-neutral-700 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-neutral-600"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-neutral-400 mb-1 text-sm">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 bg-black text-white border border-neutral-700 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-neutral-600"
            />
          </div>

          {/* Login Button */}
          <button
            type="button"
            className="w-full bg-cyan-500 text-black py-2 rounded-lg font-semibold
            hover:bg-cyan-400 transition shadow-[0_0_15px_rgba(0,255,255,0.4)]"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-neutral-800"></div>
          <span className="text-neutral-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-neutral-800"></div>
        </div>

        {/* Google Login */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 border border-neutral-700
          py-2 rounded-lg text-white hover:border-cyan-500
          hover:shadow-[0_0_12px_rgba(0,255,255,0.3)] transition"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>

        {/* Footer Links */}
        <div className="flex justify-between items-center mt-6 text-sm">
          <span className="text-neutral-500 hover:text-cyan-400 cursor-pointer">
            Forgot password?
          </span>
          <span className="text-neutral-500">
            New here?{" "}
            <span className="text-cyan-400 cursor-pointer hover:underline">
              Create account
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
