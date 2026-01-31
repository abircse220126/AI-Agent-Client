import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { GoEyeClosed } from "react-icons/go";
import { IoEyeOutline } from "react-icons/io5";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // create Account with Email and Password 
  const handleRegister = (data) => {
    const {name , email , password}=data
    const image = data.photo[0]
    console.log(name , email , password);
    console.log(image)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-black border border-neutral-800 rounded-2xl p-8 shadow-[0_0_40px_rgba(0,255,255,0.05)]">
        {/* Logo / Title */}
        <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-wide">
          AI WebBuilder
        </h2>
        <p className="text-center text-neutral-400 mb-6 text-sm">
          Build websites with AI in seconds
        </p>

        <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
          {/* Full Name */}
          <fieldset>
            <div>
              <label className="block text-neutral-400 mb-1 text-sm">
                Full Name
              </label>
              <input
                type="text"
                {...register("name", { required: true })}
                placeholder="Enter your name"
                className="w-full px-4 py-2 bg-black text-white border border-neutral-700 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-neutral-600"
              />
            </div>
            {errors.name?.type === "required" && (
              <p className="text-white">Name is Required</p>
            )}

            {/* Email */}
            <div>
              <label className="block text-neutral-400 mb-1 text-sm">
                Email Address
              </label>
              <input
                type="email"
                {...register("email", { required: true })}
                placeholder="example@gmail.com"
                className="w-full px-4 py-2 bg-black text-white border border-neutral-700 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-neutral-600"
              />
            </div>
            {errors.email?.type === "required" && (
              <p className="text-white">Email is Required</p>
            )}

            {/* Password */}
            <div>
              <label className="block text-neutral-400 mb-1 text-sm">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  {...register("password", {
                    required: true,
                    minLength: 6,
                    pattern: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
                  })}
                  className="w-full px-4 py-2 bg-black text-white border border-neutral-700 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-neutral-600"
                />
                {errors.password?.type === "required" && (
                  <p className="text-white">password is fequired</p>
                )}
                {errors.password?.type === "minLength" && (
                  <p className="text-white">
                    password must be 6 character or long
                  </p>
                )}
                {errors.password?.type === "pattern" && (
                  <p className="text-white">
                    password must be atleast one upercase and one Special
                    Character
                  </p>
                )}

                <div
                  onClick={handleShowPassword}
                  className="absolute left-85 top-4"
                >
                  {showPassword ? <GoEyeClosed /> : <IoEyeOutline />}
                </div>
              </div>
            </div>

            {/* Upload Image */}
            <div>
              <label className="block text-neutral-400 mb-1 text-sm">
                Profile Image
              </label>
              <input
                type="file"
                {...register("photo",{required:true})}
                accept="image/*"
                className="w-full border border-dashed border-neutral-700 rounded-lg p-2
              text-neutral-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0 file:text-sm
              file:bg-neutral-900 file:text-cyan-400
              hover:file:bg-neutral-800"
              />
            </div>
             {errors.photo?.type === "required" && <p className="text-white">Photo is Required</p>}

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-cyan-500 text-black py-2 rounded-lg font-semibold
            hover:bg-cyan-400 transition shadow-[0_0_15px_rgba(0,255,255,0.4)]"
            >
              Create Account
            </button>
          </fieldset>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-neutral-800"></div>
          <span className="text-neutral-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-neutral-800"></div>
        </div>

        {/* Google Login */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-3 border border-neutral-700
          py-2 rounded-lg text-white hover:border-cyan-500 hover:shadow-[0_0_12px_rgba(0,255,255,0.3)]
          transition"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>

        {/* Footer */}
        <p className="text-center text-neutral-500 text-sm mt-6">
          Already building with AI?{" "}
          <span className="text-cyan-400 cursor-pointer hover:underline">
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
