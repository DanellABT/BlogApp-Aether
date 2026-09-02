#

A RESTful API built with Express, Node.js, and MongoDB for a micro-blogging application similar to X (Twitter).

## Features
- **Authentication**: JWT-based secure login and registration.
- **Posts**: Users can perform CRUD operations on posts.
- **Authorization Rules**: 
  - Users can only edit/delete their own posts.
  - Admins can delete any post across the platform to moderate content.
- **Comments**: Authenticated users can leave comments on any blog post.

## Test Credentials
To test Admin deletion functionality vs Standard User functionality:

**Admin Account**
- Email: `admin@mail.com`
- Password: `admin123`
*(Note: Ensure you set `isAdmin: true` manually in MongoDB Compass for this account).*

**Standard User Account**
- Username: `user`
- Email: `user@mail.com`
- Password: `user123`