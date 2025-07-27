import bcrypt from 'bcryptjs'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { logAuditEvent } from './audit-log'
import { User } from './models/User'
import clientPromise from './mongodb'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const client = await clientPromise
          const db = client.db()
          const users = db.collection<User>('users')

          const user = await users.findOne({ email: credentials.email })

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user._id?.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          const client = await clientPromise
          const db = client.db()
          const users = db.collection<User>('users')

          // Check if user already exists
          const existingUser = await users.findOne({ email: user.email || '' })

          if (!existingUser) {
            // Create new user
            const newUser: User = {
              name: user.name || '',
              email: user.email || '',
              password: '', // Google users don't need password
              role: 'user',
              createdAt: new Date(),
              googleId: profile?.sub,
              image: user.image,
            }

            await users.insertOne(newUser)
          }

          // Log login event
          const userId = existingUser?._id?.toString() || (user.id ? user.id : undefined)
          await logAuditEvent(
            'login',
            userId,
            user.email || '',
            undefined,
            undefined,
            undefined,
            undefined,
            undefined
          )

          return true
        } catch (error) {
          console.error('Google sign-in error:', error)
          return false
        }
      }

      // Log login event for credentials
      if (account?.provider === 'credentials' && user) {
        await logAuditEvent(
          'login',
          user.id,
          user.email || '',
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        )
      }

      return true
    }
  },
  events: {
    async signOut({ token, session }) {
      if (token) {
        await logAuditEvent(
          'logout',
          token.id as string,
          token.email as string,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        )
      }
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
} 