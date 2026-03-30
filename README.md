# VisionX Community ���

> A full-stack developer community platform built by AITS students for collaborative learning, Q&A, and project showcasing.

**Live URLs:**
- ��� **Frontend:** https://visionx-community.netlify.app
- ��� **Backend API:** https://visionx-community-6fmh.onrender.com
- ��� **GitHub:** https://github.com/jnaveen700/VisionX-community

---

## ✨ Key Features

### ✅ Production-Ready Features

| Feature | Status | Details |
|---------|--------|---------|
| **User Authentication** | ✅ | Register, login, JWT tokens, session persistence |
| **Reward Points System** | ✅ | Ask +5pts, Answer +10pts, Accept +25pts, Upvote +2pts |
| **Questions & Answers** | ✅ | Create, browse, answer, accept best answer, upvote |
| **Mobile Responsive** | ✅ | Touch-friendly, hamburger menu, <768px optimized |
| **User Profile** | ✅ | Points, badges, stats, personal activity |
| **Projects Showcase** | ✅ | Create, browse, like, comment on projects |

---

## ���️ Tech Stack

**Frontend:** React 18, Vite, Redux Toolkit, React Router v6, Axios, Tailwind CSS  
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs  
**Deployment:** Netlify (frontend), Render (backend)

---

## ��� Quick Start

### Prerequisites
- Node.js 18+, npm
- MongoDB Atlas account (free tier)

### Installation

```bash
# Clone repo
git clone https://github.com/jnaveen700/VisionX-community.git
cd visionX

# Install dependencies
cd server && npm install && cd ..
cd client && npm install && cd ..

# Create .env (root directory)
cat > .env << 'ENVEOF'
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/visionx
JWT_SECRET=your_super_secret_key_here_min_32_characters
JWT_EXPIRATION=7d
VITE_BACKEND_URL=http://localhost:5000
NODE_ENV=development
ENVEOF

# Start development
# Terminal 1:
cd server && npm run dev

# Terminal 2:
cd client && npm run dev
```

Visit: http://localhost:5173

---

## ��� API Endpoints

```
AUTH
  POST   /api/auth/register       # Create account (name, email, password)
  POST   /api/auth/login          # Login (email, password)
  GET    /api/auth/me             # Get current user (protected)

QUESTIONS
  GET    /api/questions           # All questions
  POST   /api/questions           # Create (+5pts, protected)
  GET    /api/questions/:id       # Single question
  POST   /api/questions/:id/answers           # Post answer (+10pts, protected)
  PUT    /api/questions/:id/answers/accept    # Accept answer (+25pts, protected)
  PUT    /api/questions/:id/answers/upvote    # Upvote (+2pts, protected)

PROJECTS
  GET    /api/projects            # All projects
  POST   /api/projects            # Create (protected)
  GET    /api/projects/:id        # Single project
  PUT    /api/projects/:id/like   # Like (protected)
  POST   /api/projects/:id/comments  # Comment (protected)
```

---

##  ��� Features Explained

### Points System
- **Ask Question:** +5 pts
- **Answer Question:** +10 pts
- **Answer Accepted:** +25 pts (answerer) + 5 pts (asker)
- **Answer Upvoted:** +2 pts per upvote
- Points display in navbar & profile

### Mobile Responsive
- Hamburger menu for <768px screens
- 44px+ touch targets
- Flexible typography
- No horizontal scrolling

### Session Management
- Login → JWT token + user stored
- Refresh → App fetches user data
- Valid token → stay logged in
- Invalid token → auto logout

---

## ��� Project Structure

```
visionX/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI
│   │   ├── pages/          # Page components
│   │   ├── features/       # Redux slices
│   │   ├── utils/          # API client
│   │   └── App.jsx         # Main component
│   └── vite.config.js
│
├── server/                  # Express backend
│   ├── controllers/         # Business logic
│   ├── models/             # Database schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth verification
│   └── server.js           # Main server
│
└── netlify.toml            # Deployment config
```

---

## ��� Security

✅ Passwords hashed with bcryptjs (salt: 10)  
✅ JWT tokens (7-day expiration)  
✅ Protected routes require token header  
✅ CORS configured for allowed origins  
✅ Environment variables for secrets  

---

## ��� Test Account

```
Email: test@aits.edu
Password: test123
```

---

## ��� Debugging Check

- ✅ **Only CSS linter warnings** (no build errors)
- ✅ **All JavaScript files syntax valid**
- ✅ **All routes responding correctly**
- ✅ **Database connections stable**
- ✅ **Authentication working**
- ✅ **Points system functional**

---

## ��� Learn More

- React Docs: https://react.dev
- Express Guide: https://expressjs.com
- MongoDB: https://docs.mongodb.com
- Tailwind CSS: https://tailwindcss.com

---

## ��� Credits

- **Developer:** Naveen Kumar
- **Institution:** AITS CSE 2026
- **Project:** Web Development

---

**Status:** ✅ Production Ready | **Last Updated:** March 30, 2026
