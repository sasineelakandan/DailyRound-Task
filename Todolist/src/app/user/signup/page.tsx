"use client";
import axios from "axios";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { setUserDetails } from "../../../Store/slices/userSlice";
import { useDispatch } from "react-redux";
import { signupApi } from "@/Service/userApi/page";

interface SignUpFormValues {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  age: number;
  address: string;
  gender: string;
}

function SignUp() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormValues>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const password = watch("password");

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
    try {
      setLoading(true);
      const response = await signupApi(data);
      if (response.data) {
        toast.success("Sign Up successful! Please verify your email.");
        dispatch(
          setUserDetails({
            username: response.data.username,
            email: response.data.email,
            userId: response.data.id,
            isAuthenticated: false,
          })
        );
        setTimeout(() => {
          router.replace(`/user/home/`);
        }, 2000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "An unexpected error occurred.";
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-lg transition-all duration-300 hover:shadow-3xl"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Sign Up
        </h2>
        <div className="space-y-4">
          {/* Username */}
          <div>
            <input
              {...register("username", { required: "Username is required" })}
              type="text"
              placeholder="Create Username"
              className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring focus:ring-indigo-300 outline-none"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
          </div>

          {/* Email */}
          <div>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring focus:ring-indigo-300 outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <input
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter a valid 10-digit phone number",
                },
              })}
              type="tel"
              placeholder="Enter Phone Number"
              className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring focus:ring-indigo-300 outline-none"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>

          {/* Age */}
          <div>
            <input
              {...register("age", {
                required: "Age is required",
                min: { value: 18, message: "You must be at least 18 years old" },
              })}
              type="number"
              placeholder="Enter your age"
              className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring focus:ring-indigo-300 outline-none"
            />
            {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
          </div>

          {/* Address */}
          <div>
            <input
              {...register("address", { required: "Address is required" })}
              type="text"
              placeholder="Enter your address"
              className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring focus:ring-indigo-300 outline-none"
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters long" },
              })}
              type={showPassword ? "text" : "password"}
              placeholder="Create Password"
              className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring focus:ring-indigo-300 outline-none"
            />
            <span onClick={togglePasswordVisibility} className="absolute right-4 top-3 cursor-pointer text-gray-600">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === password || "Passwords do not match",
              })}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter Password"
              className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring focus:ring-indigo-300 outline-none"
            />
            <span onClick={toggleConfirmPasswordVisibility} className="absolute right-4 top-3 cursor-pointer text-gray-600">
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
          </div>

          {/* Gender */}
          <div>
            <select
              {...register("gender", { required: "Gender is required" })}
              className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring focus:ring-indigo-300 outline-none"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default SignUp;
