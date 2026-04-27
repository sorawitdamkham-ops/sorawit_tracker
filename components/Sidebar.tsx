"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Sidebar() {
    const pathname = usePathname()

    return (
    <div>
        <div className="fixed top-0 left-0 h-screen w-60 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-200 p-5 flex flex-col border-r border-white/10 shadow-xl">

            {/* LOGO */}
            <div className="flex flex-col items-center mb-8">
                <img
                    src="/logo_login_register_fr.svg"
                    alt="logo"
                    className="w-30 h-30 object-contain drop-shadow-lg mb-2"
                />
                <h1 className="text-lg font-semibold tracking-wide text-white">
                    Finance Tracker
                </h1>
            </div>

            {/* NAV */}
            <nav className="flex flex-col gap-2">

                <Link
                    href="/dashboard"
                    className={`relative p-3 rounded-lg transition-all duration-200 group ${
                        pathname === "/dashboard"
                            ? "bg-green-600/20 text-green-400 border border-green-500/30"
                            : "hover:bg-gray-700/60 hover:text-white"
                    }`}
                >
                    <span className="relative z-10">Dashboard</span>
                    <span className="absolute inset-0 rounded-lg bg-green-500 opacity-0 group-hover:opacity-10 transition duration-300"></span>
                </Link>

                <Link
                    href="/profile"
                    className={`relative p-3 rounded-lg transition-all duration-200 group ${
                        pathname === "/profile"
                            ? "bg-green-600/20 text-green-400 border border-green-500/30"
                            : "hover:bg-gray-700/60 hover:text-white"
                    }`}
                >
                    <span className="relative z-10">Profile</span>
                    <span className="absolute inset-0 rounded-lg bg-green-500 opacity-0 group-hover:opacity-10 transition duration-300"></span>
                </Link>

            </nav>

            {/* FOOTER */}
            <div className="mt-auto pt-6 border-t border-white/10">
                <button className="w-full text-left p-3 rounded-lg text-red-300 bg-red-500/10 transition-all duration-200 active:scale-95">
                    Logout
                </button>
            </div>
        </div>
    </div>
)
}