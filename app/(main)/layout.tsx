import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { getServerSession } from "next-auth"
import LogoutButton from "./dashboard/LogoutButton"
import { useState } from "react";
//ใช้ในการ route page


export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()


  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <div>
        <Sidebar /> {/* 👈 เรียกใช้ */}
      </div>



      <div className="flex-1 flex flex-col">

        <Navbar /> {/* 👈 ใส่ตรงนี้ */}

        <main className="ml-60 mt-16 p-6">
          {children}
        </main>

      </div>

    </div>
  )
}