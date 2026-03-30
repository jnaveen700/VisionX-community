import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentUser } from './features/authSlice.js'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'
import Questions from './pages/Questions.jsx'
import QuestionDetail from './pages/QuestionDetail.jsx'
import QuestionForm from './pages/QuestionForm.jsx'
import Projects from './pages/Projects.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import ProjectForm from './pages/ProjectForm.jsx'
import Resources from './pages/Resources.jsx'
import Navbar from './components/Navbar.jsx'

function App() {
  const dispatch = useDispatch()
  const { token } = useSelector(state => state.auth)
  
  // Log on app load
  console.log('%c🚀 VisionX App Started', 'color: #ff6b6b; font-weight: bold; font-size: 14px;');
  console.log('Build time:', new Date().toLocaleString());
  
  // Restore user data on app load if token exists
  useEffect(() => {
    if (token) {
      console.log('🔐 Token found, restoring user data...');
      dispatch(getCurrentUser());
    }
  }, [token, dispatch]);
  
  useEffect(() => {
    console.log('✅ App mounted successfully');
    console.log('📍 Current pathname:', window.location.pathname);
    
    // Test button click
    const testBtn = document.createElement('button');
    testBtn.addEventListener('click', () => {
      console.log('✅ Button click event listener works!');
    });
    console.log('🧪 Testing event listeners...');
    
    return () => {
      console.log('🔌 App unmounting');
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <Navbar />
      <main className="flex-1 w-full py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="container-responsive">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/questions/new" element={<QuestionForm />} />
            <Route path="/questions/:id" element={<QuestionDetail />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/projects/new" element={<ProjectForm />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/resources" element={<Resources />} />
          </Routes>
        </div>
      </main>
      <footer className="bg-white border-t border-gray-100 py-6 sm:py-8 w-full">
        <div className="container-responsive">
          <div className="flex flex-col items-center justify-center gap-4 sm:gap-6">
            <p className="text-gray-600 text-sm sm:text-base text-center">
              VisionX Community • {new Date().getFullYear()}
            </p>
            <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors text-sm sm:text-base">About</a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors text-sm sm:text-base">Contact</a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors text-sm sm:text-base">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
