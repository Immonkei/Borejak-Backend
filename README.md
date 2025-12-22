# Create README.md in your local repo
cat > README.md << 'EOF'
# Blood Donation Backend API

A backend API for blood donation management system built with Node.js, Express, Firebase Authentication, and Supabase.

## Features
- User authentication with Firebase
- Blood donation management
- Hospital information
- Event management
- Testimonials and tips
- Newsletter subscription

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Firebase Auth
- **Deployment:** Vercel

## Environment Variables
Create a `.env` file in the root directory:

```bash
# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=your-private-key

# Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-key

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

# App
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:5000