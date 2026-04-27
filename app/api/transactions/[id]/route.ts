import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

// แยกการเขียน API Delete กับ Edit(PUT) ออกมา เพราะต้องยึดตาม id ของ transactions หากจะลบหรือแก้ไข 
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession()

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const transaction = await prisma.transaction.findUnique({
            where: { id: params.id }
        })

        if (!transaction || transaction.userId !== user.id) {
            return NextResponse.json({ error: "Not allowed" }, { status: 403 })
        }

        await prisma.transaction.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ message: "Deleted" })
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession()

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const transaction = await prisma.transaction.findUnique({
            where: { id: params.id }
        })

        if (!transaction || transaction.userId !== user.id) {
            return NextResponse.json({ error: "Not allowed" }, { status: 403 })
        }

        const body = await req.json()

        const updated = await prisma.transaction.update({
            where: { id: params.id },
            data: {
                type: body.type,
                amount: Number(body.amount),
                category: body.category,
                description: body.description,
                date: new Date(body.date)
            }
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("PUT ERROR:", error)

        return NextResponse.json(
            { error: String(error) },
            { status: 500 }
        )
    }
}