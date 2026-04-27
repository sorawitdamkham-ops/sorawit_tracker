"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

export default function ProfilePage() {
  const { data: session } = useSession()

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("")
  const { update } = useSession()
  const [originalName, setOriginalName] = useState("")


  // ยิง api เพื่อ fetch ชื่อของ user
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/user")

      // ✅ เช็คก่อน parse
      if (!res.ok) {
        console.error("Fetch failed")
        return
      }
      const data = await res.json()

      setName(data.name || "")
      setOriginalName(data.name || "")
    }

    fetchUser()
  }, [])



  return (
  <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-24 px-4">

    <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-md border border-gray-200">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Edit Profile
      </h1>

      {/* Email */}
      <div className="mb-5">
        <label className="text-sm text-gray-500">Email</label>
        <p className="mt-1 bg-gray-100 p-3 rounded-lg text-gray-700 border border-gray-200">
          {session?.user?.email}
        </p>
      </div>

      {/* Name */}
      <div className="mb-6">
        <label className="text-sm text-gray-500">Name</label>

        {isEditing ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
        ) : (
          <p className="mt-1 bg-gray-100 p-3 rounded-lg text-gray-700 border border-gray-200">
            {name || "-"}
          </p>
        )}
      </div>

      {/* Buttons */}
      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg transition shadow-sm hover:shadow-md active:scale-95"
        >
          Edit
        </button>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={async () => {
              await fetch("/api/user", {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({ name })
              })

              await update() // 👈 รีเฟรช session

              setOriginalName(name) //อัพเดทเป็นชื่อใหม่พี่เพิ่งแก้ไข
              setIsEditing(false)
            }}
            className="bg-green-600 hover:bg-green-500 text-white px-5 py-2.5 rounded-lg transition shadow-sm hover:shadow-md active:scale-95"
          >
            Save
          </button>

          <button
            onClick={() => {
              setIsEditing(false)
              setName(originalName) // ✅ ใช้ค่าที่เก็บไว้
            }}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2.5 rounded-lg transition active:scale-95"
          >
            Cancel
          </button>
        </div>
      )}
    </div>

  </div>
)
}