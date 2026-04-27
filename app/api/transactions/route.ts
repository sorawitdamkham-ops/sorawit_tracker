import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

export async function POST(req: Request) {
  try {

    // ดึง user ที่กำลัง login อยู่
    const session = await getServerSession()

    // กรณีหา session ไม่เจอ
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { type, amount, category, description, date } = body

    if (!type || !amount || !category || !description || !date) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      )
    }

    // หา user จาก email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount: Number(amount),
        category,
        description,
        date: new Date(date),
        userId: user.id
      }
    })

    return NextResponse.json(transaction)
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401
      })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404
      })
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" }
    })

    return new Response(JSON.stringify(transactions), {
      status: 200
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500
    })
  }
}