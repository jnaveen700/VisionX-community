# VisionX Developer Community 🚀

## College Project - AITS 2025
- **College:** Annamacharya Institute of Technology and Sciences
- **Department:** Computer Science and Engineering
- **Course:** Web Development Project
- **Year:** 2025

## About My Project 📚
Hi! I'm [Your Name], and this is my web development project. I created a simple community platform where beginner developers (like me!) can:
- Ask questions without feeling shy
- Share their small projects
- Learn from other students
- Earn points and badges for helping others

## What I Learned 🎓
Through this project, I learned about:
- Node.js and Express for making web servers
- MongoDB for storing data
- React for building user interfaces
- How to make login/signup systems
- Working with databases
- Basic security practices

## Tech Stack

- **Frontend:**
  - React
  - React Router
  - Redux Toolkit
  - TailwindCSS
  - Vite

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - JWT Authentication

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Create a `.env` file in the server directory with:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server (in a new terminal)
   cd client
   npm run dev
   ```

## Project Structure

```
visionx/
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── features/     # Redux slices
│   │   └── App.jsx       # Main app component
│   └── package.json
│
└── server/               # Node.js backend
    ├── controllers/     # Route controllers
    ├── models/         # Mongoose models
    ├── routes/         # Express routes
    ├── middleware/     # Custom middleware
    └── server.js      # Server entry point
```

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

ISC License
