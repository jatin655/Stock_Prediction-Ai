const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')

async function createAdminUser() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/crystalstock'
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const db = client.db()
    const users = db.collection('users')

    // Check if admin already exists
    const existingAdmin = await users.findOne({ role: 'admin' })
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email)
      return
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const adminUser = {
      name: 'System Administrator',
      email: 'admin@crystalstock.ai',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      image: null,
    }

    const result = await users.insertOne(adminUser)
    console.log('Admin user created successfully:')
    console.log('Email: admin@crystalstock.ai')
    console.log('Password: admin123')
    console.log('User ID:', result.insertedId)

  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await client.close()
  }
}

createAdminUser() 