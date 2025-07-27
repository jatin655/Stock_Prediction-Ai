import { ObjectId } from 'mongodb'

export interface User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  role: 'user' | 'admin'
  createdAt: Date
  resetToken?: string
  resetTokenExpiry?: Date
  googleId?: string
  image?: string
} 