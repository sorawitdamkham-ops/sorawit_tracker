"use client"

import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { User } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()
  // ตอนนี้ useSession() ยังใช้ไม่ได้เพราะ layout ยังไม่ถูกครอบด้วย Provider
  const { data: session } = useSession()

  const getTitle = () => {
    if (pathname === "/dashboard") return "Dashboard"
    if (pathname === "/profile") return "Profile"
    return "App"
  }

  return (
  <div className="fixed top-0 left-60 right-0 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-gray-200 border-b border-white/10 px-6 py-3 flex justify-between items-center z-10 backdrop-blur-md shadow-lg">

    {/* Left: Page Title */}
    <h1 className="text-lg font-semibold text-white tracking-wide">
      {getTitle()}
    </h1>

    {/* Right: User */}
    <div className="flex items-center gap-4">

      <div className="text-right">
        <p className="text-sm text-gray-300">
          {session?.user?.email}
        </p>
      </div>

      {/* Avatar */}
      <User className="w-6 h-6"/>

      {/* Logout */}
      <button
        onClick={() => signOut()}
        className="relative px-3 py-1.5 text-sm text-red-400 rounded-md hover:text-red-300 transition-all duration-200 active:scale-95 group"
      >
        <span className="relative z-10">Logout</span>
        <span className="absolute inset-0 rounded-md bg-red-500 opacity-0 group-hover:opacity-10 transition duration-300"></span>
      </button>

    </div>
  </div>
)
}