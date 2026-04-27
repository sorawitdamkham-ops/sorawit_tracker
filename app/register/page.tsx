"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()


    // เรียกใช้ POST จาก /api/register
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password, name })
    })

    if (res.ok) {
      alert("Register success")
      router.push("/login")
    } else {
      alert("Register failed")
    }
  }

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 px-4 py-6">

    <form
      onSubmit={handleRegister}
      className="w-full max-w-md backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl shadow-2xl 
      p-5 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-5"
    >
      {/* Logo */}
      <div className="flex justify-center">
        <img
          src="/logo_login_register_fr.svg"
          alt="logo"
          className="w-28 sm:w-32 md:w-40 h-auto object-contain drop-shadow-lg"
        />
      </div>

      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-semibold text-center text-white tracking-wide">
        Create Account
      </h1>
      <p className="text-center text-gray-400 text-xs sm:text-sm">
        Start managing your finances
      </p>

      {/* Name */}
      <div className="flex flex-col gap-1">
        <label className="text-xs sm:text-sm text-gray-300">Name</label>
        <input
          type="text"
          placeholder="Your name"
          className="bg-gray-800/70 border border-gray-700 text-white px-3 py-3 rounded-lg outline-none 
          focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm sm:text-base"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label className="text-xs sm:text-sm text-gray-300">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="bg-gray-800/70 border border-gray-700 text-white px-3 py-3 rounded-lg outline-none 
          focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm sm:text-base"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1">
        <label className="text-xs sm:text-sm text-gray-300">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          className="bg-gray-800/70 border border-gray-700 text-white px-3 py-3 rounded-lg outline-none 
          focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm sm:text-base"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Button */}
      <button
        className="relative overflow-hidden bg-green-600 hover:bg-green-500 text-white font-medium 
        py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/40 active:scale-95 text-sm sm:text-base"
      >
        <span className="relative z-10">Register</span>
        <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-0 hover:opacity-20 transition duration-300"></span>
      </button>

      {/* Footer */}
      <p className="text-center text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
        Already have an account?{" "}
        <Link href="/login">
          <span className="text-green-400 hover:underline cursor-pointer">
            Login
          </span>
        </Link>
      </p>
    </form>
  </div>
)
}