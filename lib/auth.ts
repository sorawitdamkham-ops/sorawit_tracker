// lib/auth.ts

import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// Next.js ไม่อนุญาตให้ export อย่างอื่นนอกจาก Get Post ตอน deploy จึงจำเป็นต้องมาสร้างใน lib และ import ไปใช้ในไฟล์อื่นๆ
// คือ [...nextauth]/route.ts
export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                return {
                    id: "1",
                    email: "test@test.com",
                    name: "test"
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
}