import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import { useState } from 'react';

function Navbar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, isAuthenticated, user } = useSelector(state => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  console.log('🔍 [NAVBAR] Auth state:', { token: !!token, isAuthenticated });
  console.log('🔍 [NAVBAR] Token length:', token?.length || 0);
  console.log('🔍 [NAVBAR] LocalStorage token:', !!localStorage.getItem('token'));
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    console.log('🚪 [NAVBAR] Logout clicked');
    dispatch(logout());
    navigate('/');
    setMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
              VisionX
            </span>
            <span className="hidden sm:inline text-gray-600 text-sm sm:text-base">Community</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              Home
            </Link>
            <Link
              to="/questions"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/questions')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              Questions
            </Link>
            <Link
              to="/projects"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/projects')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              Projects
            </Link>
            <Link
              to="/resources"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/resources')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              Resources
            </Link>
          </div>

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/search"
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            
            {token && user ? (
              <div className="flex items-center gap-2">
                {/* Points Display */}
                <Link
                  to="/profile"
                  className="flex items-center gap-1 bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-2 rounded-lg border border-blue-200 hover:border-blue-400 transition-colors text-sm"
                >
                  <span className="text-lg">⭐</span>
                  <span className="font-bold text-blue-600">{user.points || 0}</span>
                  <span className="hidden sm:inline text-xs text-gray-600">pts</span>
                </Link>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors shadow-sm hover:shadow"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm hover:shadow"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center w-10 h-10"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-3 space-y-2">
              {/* Navigation Links */}
              <Link
                to="/"
                onClick={closeMenu}
                className={`block px-4 py-3 rounded-md font-medium transition-colors min-h-[44px] flex items-center ${
                  isActive('/') 
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Home
              </Link>
              <Link
                to="/questions"
                onClick={closeMenu}
                className={`block px-4 py-3 rounded-md font-medium transition-colors min-h-[44px] flex items-center ${
                  isActive('/questions')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Questions
              </Link>
              <Link
                to="/projects"
                onClick={closeMenu}
                className={`block px-4 py-3 rounded-md font-medium transition-colors min-h-[44px] flex items-center ${
                  isActive('/projects')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Projects
              </Link>
              <Link
                to="/resources"
                onClick={closeMenu}
                className={`block px-4 py-3 rounded-md font-medium transition-colors min-h-[44px] flex items-center ${
                  isActive('/resources')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Resources
              </Link>

              {/* Divider */}
              <div className="border-t border-gray-100 my-2"></div>

              {/* Auth Section */}
              {token && user ? (
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="block px-4 py-3 rounded-md text-sm font-medium bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-600 min-h-[44px] flex items-center"
                  >
                    <span className="text-lg mr-2">⭐</span>
                    {user.points || 0} Points
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors min-h-[44px]"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="block w-full px-4 py-3 rounded-lg bg-blue-500 text-white text-center font-medium hover:bg-blue-600 transition-colors min-h-[44px] flex items-center justify-center"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
