"use client"

import { useState, useEffect } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip
} from "recharts";


export default function DashboardPage() {
    const [type, setType] = useState("expense")
    const [amount, setAmount] = useState("")
    const [category, setCategory] = useState("")
    const [description, setDescription] = useState("")
    const [date, setDate] = useState("")
    const [transactions, setTransactions] = useState<any[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().toISOString().slice(0, 7)
    )
    // show all transactions
    const [showAll, setShowAll] = useState(false)
    // ค้นหาแบบ real time
    const [search, setSearch] = useState("")
   

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("/api/transactions")
            const data = await res.json()
            setTransactions(data)
        }

        fetchData()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // การ fetch คือการยิง API หรือยิงไปที่ route นั่นแหล่ะ
        const res = await fetch("/api/transactions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                type,
                amount,
                category,
                description,
                date
            })
        })

        // ข้อมูลอัพเดทเองโดยไม่ต้อง refresh
        const newTransaction = await res.json()
        setTransactions((prev) => [newTransaction, ...prev])

        if (res.ok) {
            alert("เพิ่มรายการสำเร็จ ✅")

            // reset form
            setAmount("")
            setCategory("")
            setDescription("")
            setDate("")
        } else {
            alert("เกิดข้อผิดพลาด ❌")
        }
    }

    // filter transactions ตามเดือนที่เลือก
    // or show all transactions
    const filteredTransactions = transactions
        .filter((t) => {
            // filter เดือน
            if (!showAll && !t.date.startsWith(selectedMonth)) {
                return false
            }

            // filter search
            const keyword = search.toLowerCase()

            return (
                t.description.toLowerCase().includes(keyword) ||
                t.category.toLowerCase().includes(keyword) ||
                t.amount.toString().includes(keyword)
            )
        })

    const categoryMap: Record<string, number> = {}
    // filter expense ตามประเภท เพื่อให้รู้ว่าหมดเงินไปกับอะไรบ้าง
    filteredTransactions.forEach((t) => {
        if (t.type === "expense") {
            if (!categoryMap[t.category]) {
                categoryMap[t.category] = 0
            }
            categoryMap[t.category] += Number(t.amount)
        }
    })

    const categoryData = Object.keys(categoryMap).map((key) => ({
        name: key,
        value: categoryMap[key]
    }))
    // function ในการคำนวณต่างๆ
    // filter แยก reduce รวม
    const totalIncome = filteredTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0)

    const totalExpense = filteredTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0)

    const balance = totalIncome - totalExpense

    // กำหนดข้อมูลให้กับ chart
    const chartData = [
        { name: "Income", value: totalIncome },
        { name: "Expense", value: totalExpense }
    ]

    const handleExport = () => {
        const headers = [
            "Type",
            "Amount",
            "Category",
            "Description",
            "Date"
        ]

        const rows = filteredTransactions.map((t) => [
            t.type,
            t.amount,
            t.category,
            t.description,
            new Date(t.date).toLocaleDateString()
        ])

        const csvContent =
            [headers, ...rows]
                .map((row) => row.join(","))
                .join("\n")
        // เพื่อย้ำว่า นี่คือ UTF-8 นะ ไม่งั้นตัวอักษรจะเพี้ยน
        const BOM = "\uFEFF"

        const blob = new Blob([BOM + csvContent], {
            type: "text/csv;charset=utf-8;"
        })

        const url = URL.createObjectURL(blob)

        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", "transactions.csv")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }


    return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-semibold mb-3 md:mb-0">Dashboard</h1>

            <div className="flex flex-wrap gap-3 items-center">
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 bg-white px-4 py-2 rounded-lg w-60 focus:ring-2 focus:ring-green-500 outline-none"
                />

                <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => {
                        setSelectedMonth(e.target.value)
                        setShowAll(false) // ถ้าเลือกเดือน → ปิด show all
                    }}
                    className="border border-gray-300 bg-white px-3 py-2 rounded-lg"
                />

                <button
                    onClick={() => setShowAll(true)}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition"
                >
                    Show All
                </button>

                <button
                    onClick={handleExport}
                    className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition shadow"
                >
                    Export CSV
                </button>
            </div>
        </div>

        <p className="text-sm text-gray-500 mb-6">
            {showAll ? "Showing all transactions" : `Showing: ${selectedMonth}`}
        </p>

        {/* grid-cols-3 คือแบ่งออกเป็นสามคอลัมน์หรือสามการ์ดนั่นเอง */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

            <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
                <p className="text-sm text-gray-500">Income</p>
                <p className="text-2xl font-bold text-green-600">
                    ฿{totalIncome}
                </p>
            </div>

            <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
                <p className="text-sm text-gray-500">Expense</p>
                <p className="text-2xl font-bold text-red-500">
                    ฿{totalExpense}
                </p>
            </div>

            <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
                <p className="text-sm text-gray-500">Balance</p>
                <p className="text-2xl font-bold text-blue-600">
                    ฿{balance}
                </p>
            </div>

        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT: CHART */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Overview</h2>

                <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                    <PieChart width={260} height={260}>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={90}
                            label
                        >
                            <Cell fill="#22c55e" /> {/* green */}
                            <Cell fill="#ef4444" /> {/* red */}
                        </Pie>
                        <Tooltip />
                    </PieChart>

                    <PieChart width={260} height={260}>
                        <Pie
                            data={categoryData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={90}
                            label
                        />
                        <Tooltip />
                    </PieChart>
                </div>
            </div>

            {/* RIGHT: FORM */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Add Transaction</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="border border-gray-300 p-2 rounded"
                    >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>

                    <input
                        type="number"
                        placeholder="Amount"
                        className="border border-gray-300 p-2 rounded"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Category"
                        className="border border-gray-300 p-2 rounded"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Description"
                        className="border border-gray-300 p-2 rounded"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <input
                        type="date"
                        className="border border-gray-300 p-2 rounded"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />

                    <button className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-lg transition active:scale-95">
                        Add Transaction
                    </button>
                </form>
            </div>
        </div>

        {/* LIST */}
        <div className="mt-10 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Transactions</h2>

            {filteredTransactions.map((t) => (
                <div key={t.id} className="border border-gray-200 p-4 mb-3 rounded-lg bg-gray-50">

                    {/* TYPE */}
                    {editingId === t.id ? (
                        <select
                            value={t.type}
                            onChange={(e) => {
                                setTransactions((prev) =>
                                    prev.map((item) =>
                                        item.id === t.id
                                            ? { ...item, type: e.target.value }
                                            : item
                                    )
                                )
                            }}
                        >
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    ) : (
                        <p>Type: {t.type}</p>
                    )}

                    {/* AMOUNT */}
                    {editingId === t.id ? (
                        <input
                            type="number"
                            value={t.amount}
                            onChange={(e) => {
                                setTransactions((prev) =>
                                    prev.map((item) =>
                                        item.id === t.id
                                            ? { ...item, amount: e.target.value }
                                            : item
                                    )
                                )
                            }}
                        />
                    ) : (
                        <p>Amount: {t.amount}</p>
                    )}

                    {/* CATEGORY */}
                    {editingId === t.id ? (
                        <input
                            value={t.category}
                            onChange={(e) => {
                                setTransactions((prev) =>
                                    prev.map((item) =>
                                        item.id === t.id
                                            ? { ...item, category: e.target.value }
                                            : item
                                    )
                                )
                            }}
                        />
                    ) : (
                        <p>Category: {t.category}</p>
                    )}

                    {/* DESCRIPTION */}
                    {editingId === t.id ? (
                        <input
                            value={t.description}
                            onChange={(e) => {
                                setTransactions((prev) =>
                                    prev.map((item) =>
                                        item.id === t.id
                                            ? { ...item, description: e.target.value }
                                            : item
                                    )
                                )
                            }}
                        />
                    ) : (
                        <p>Description: {t.description}</p>
                    )}

                    {/* DATE */}
                    {editingId === t.id ? (
                        <input
                            type="date"
                            value={t.date?.slice(0, 10)}
                            onChange={(e) => {
                                setTransactions((prev) =>
                                    prev.map((item) =>
                                        item.id === t.id
                                            ? { ...item, date: e.target.value }
                                            : item
                                    )
                                )
                            }}
                        />
                    ) : (
                        <p>Date: {new Date(t.date).toLocaleDateString()}</p>
                    )}

                    {/* ACTION */}
                    {editingId === t.id ? (
                        <button
                            onClick={async () => {
                                const res = await fetch(`/api/transactions/${t.id}`, {
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(t)
                                })

                                const updated = await res.json()

                                setTransactions((prev) =>
                                    prev.map((item) =>
                                        item.id === updated.id ? updated : item
                                    )
                                )

                                setEditingId(null)
                            }}
                            className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500"
                        >
                            Save
                        </button>
                    ) : (
                        <button
                            onClick={() => setEditingId(t.id)}
                            className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500"
                        >
                            Edit
                        </button>
                    )}

                    {/* DELETE */}
                    <button
                        onClick={async () => {
                            await fetch(`/api/transactions/${t.id}`, {
                                method: "DELETE"
                            })
                            // ลบออกได้ทันทีไม่ต้อง refresh
                            setTransactions((prev) =>
                                prev.filter((item) => item.id !== t.id)
                            )
                        }}
                        className="mt-2 ml-2 text-red-500 hover:text-red-600"
                    >
                        Delete
                    </button>

                </div>
            ))}

            <p className="text-sm text-gray-500 mb-2">
                Found {filteredTransactions.length} transactions
            </p>
        </div>
    </div>
)
}