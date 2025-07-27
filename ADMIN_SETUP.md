# Admin Setup Guide

## Overview

The admin panel provides comprehensive user management and audit logging capabilities for CrystalStock AI. Only users with admin role can access this functionality.

## Features

### 🔐 Authentication & Authorization
- **Admin-only access**: Only users with `admin` role can access the admin panel
- **Session-based security**: Uses NextAuth.js for secure authentication
- **Route protection**: Middleware automatically redirects non-admin users

### 👥 User Management
- **View all users**: See complete list of registered users
- **Role management**: Change user roles between 'user' and 'admin'
- **User details**: Display user information including join date and profile images
- **Self-protection**: Admins cannot change their own role

### 📊 Audit Logging
- **Comprehensive tracking**: Logs all login/logout events and role changes
- **Admin actions**: Tracks who performed role changes and when
- **IP tracking**: Records IP addresses for security monitoring
- **Real-time updates**: Audit logs refresh automatically after actions

## Setup Instructions

### 1. Create Admin User

Run the following command to create the first admin user:

```bash
npm run create-admin
```

This will create an admin user with:
- **Email**: admin@crystalstock.ai
- **Password**: admin123
- **Role**: admin

### 2. Environment Variables

Ensure your `.env.local` file includes:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 3. Database Collections

The system uses these MongoDB collections:
- `users` - User accounts and roles
- `auditLogs` - System activity logs

## API Endpoints

### GET /api/admin/users
- **Purpose**: Fetch all users (admin only)
- **Response**: Array of user objects (passwords excluded)

### PATCH /api/admin/users
- **Purpose**: Update user role (admin only)
- **Body**: `{ userId: string, newRole: 'user' | 'admin' }`
- **Response**: Success message with old/new role

### GET /api/admin/audit-logs
- **Purpose**: Fetch audit logs (admin only)
- **Query params**: `page`, `limit`, `action`, `userId`
- **Response**: Paginated audit logs with metadata

## Security Features

### Role-Based Access Control
- Admin routes are protected by middleware
- Non-admin users are redirected to dashboard
- Session validation on every request

### Audit Trail
- All role changes are logged with admin details
- Login/logout events are automatically tracked
- IP addresses and timestamps are recorded

### Data Protection
- Passwords are never returned in API responses
- Sensitive operations require admin authentication
- Input validation on all endpoints

## Usage

### Accessing Admin Panel
1. Login with admin credentials
2. Navigate to `/admin`
3. View user management and audit logs

### Managing Users
1. View all users in the table
2. Use the role selector to change user roles
3. Changes are immediately reflected and logged

### Viewing Audit Logs
1. Audit logs are displayed in real-time
2. Each log entry shows action, user, and timestamp
3. IP addresses are included for security monitoring

## Troubleshooting

### Common Issues

**"Forbidden - Admin access required"**
- Ensure you're logged in with an admin account
- Check that your user has `role: 'admin'` in the database

**"Cannot change your own role"**
- This is a security feature to prevent admin lockout
- Have another admin change your role if needed

**No audit logs appearing**
- Check that the `auditLogs` collection exists in MongoDB
- Verify that the audit logging functions are working

### Database Queries

To manually check user roles:
```javascript
db.users.find({ role: "admin" })
```

To view audit logs:
```javascript
db.auditLogs.find().sort({ timestamp: -1 }).limit(10)
```

## Development

### Adding New Audit Events
1. Update the `AuditLog` interface in `lib/models/AuditLog.ts`
2. Add new action types to the union type
3. Use `logAuditEvent()` function to log events

### Extending User Management
1. Add new fields to the `User` interface
2. Update the admin page UI components
3. Create corresponding API endpoints

## Security Best Practices

1. **Regular password changes**: Change admin passwords regularly
2. **Monitor audit logs**: Review logs for suspicious activity
3. **Limit admin accounts**: Only grant admin access to trusted users
4. **Backup regularly**: Ensure database backups include audit logs
5. **IP monitoring**: Watch for unusual login patterns 