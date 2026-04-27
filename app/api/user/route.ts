import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// เอาไว้แกไขชื่อ
export async function PUT(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()

    const user = await prisma.user.update({
        where: {
            email: session.user.email
        },
        data: {
            name: body.name
        }
    })

    return Response.json(user)
}

// ไว้แสดงชื่อก่อนที่จะแก้ไข แสดงชื่อล่าสุด
export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return Response.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        return Response.json(user)

    } catch (error) {
        console.error(error)
        return Response.json(
            { error: "Server error" },
            { status: 500 }
        )
    }
}