import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function Profile() {
  const navigate = useNavigate();
  const { token, user } = useSelector(state => state.auth);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        console.log('📥 Fetching user data...');
        // For now, we'll use the user data from Redux
        // In a real app, you might fetch from /api/users/me
        if (user) {
          setUserData(user);
          setLoading(false);
        }
      } catch (err) {
        console.error('❌ Error fetching user data:', err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, user, navigate]);

  if (!token) {
    return null;
  }

  if (loading) {
    return (
      <div className="w-full">
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="bg-red-50 p-4 sm:p-6 rounded-lg border border-red-200">
          <p className="text-red-600 text-sm sm:text-base">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="w-full">
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm sm:text-base">User data not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-8 border border-gray-100">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8 pb-6 sm:pb-8 border-b border-gray-200">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg flex-shrink-0">
            {userData.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{userData.name || 'User'}</h1>
            <p className="text-gray-600 capitalize text-sm sm:text-base mt-1">{userData.role || 'Member'}</p>
            <p className="text-xs sm:text-sm text-gray-500 break-all mt-1">{userData.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-lg shadow-sm border border-blue-200 min-h-[140px] flex flex-col justify-center">
            <div className="text-3xl sm:text-4xl font-bold text-blue-600">{userData.points || 0}</div>
            <h3 className="font-semibold text-gray-700 mt-2 text-sm sm:text-base">Reward Points</h3>
            <p className="text-xs text-gray-600 mt-1 leading-tight">Ask: 5pt • Answer: 10pt • Accepted: 25pt • Upvote: 2pt</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-lg shadow-sm border border-green-200 min-h-[140px] flex flex-col justify-center">
            <div className="text-3xl sm:text-4xl font-bold text-green-600">0</div>
            <h3 className="font-semibold text-gray-700 mt-2 text-sm sm:text-base">Questions Asked</h3>
            <p className="text-xs text-gray-600 mt-1">Share your knowledge</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6 rounded-lg shadow-sm border border-purple-200 min-h-[140px] flex flex-col justify-center">
            <div className="text-3xl sm:text-4xl font-bold text-purple-600">0</div>
            <h3 className="font-semibold text-gray-700 mt-2 text-sm sm:text-base">Projects Shared</h3>
            <p className="text-xs text-gray-600 mt-1">Showcase your work</p>
          </div>
        </div>

        {/* Bio Section */}
        {userData.bio && (
          <div className="mb-8 pb-6 sm:pb-8 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold mb-3">About Me</h2>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg text-sm sm:text-base leading-relaxed">{userData.bio}</p>
          </div>
        )}

        {/* Skills Section */}
        <div className="mb-8 pb-6 sm:pb-8 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Skills</h2>
          {userData.skills && userData.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userData.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 rounded-full text-xs sm:text-sm font-medium min-h-[44px] flex items-center"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm sm:text-base">No skills added yet. Update your profile to add skills!</p>
          )}
        </div>

        {/* Badges Section */}
        <div className="mb-8 pb-6 sm:pb-8 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Badges</h2>
          {userData.badges && userData.badges.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {userData.badges.map((badge, idx) => (
                <div key={idx} className="text-center p-3 sm:p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200 min-h-[120px] flex flex-col items-center justify-center">
                  <div className="text-2xl sm:text-3xl mb-2">🏆</div>
                  <p className="font-semibold text-xs sm:text-sm text-gray-700">{badge.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 sm:p-8 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-600 mb-2 text-sm sm:text-base">🎯 No badges yet!</p>
              <p className="text-xs sm:text-sm text-gray-500">
                Keep answering questions and earning points to unlock badges!
              </p>
            </div>
          )}
        </div>

        {/* Points Breakdown */}
        <div className="bg-blue-50 p-4 sm:p-6 rounded-lg border border-blue-200">
          <h2 className="text-base sm:text-lg font-bold text-blue-900 mb-4">How to Earn Points</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-blue-800">
            <div className="flex items-center gap-2 min-h-[44px] sm:min-h-auto">
              <span className="text-lg sm:text-xl flex-shrink-0">❓</span>
              <span><strong>Ask a Question:</strong> +5 points</span>
            </div>
            <div className="flex items-center gap-2 min-h-[44px] sm:min-h-auto">
              <span className="text-lg sm:text-xl flex-shrink-0">💬</span>
              <span><strong>Answer a Question:</strong> +10 points</span>
            </div>
            <div className="flex items-center gap-2 min-h-[44px] sm:min-h-auto">
              <span className="text-lg sm:text-xl flex-shrink-0">✅</span>
              <span><strong>Accepted Answer:</strong> +25 points</span>
            </div>
            <div className="flex items-center gap-2 min-h-[44px] sm:min-h-auto">
              <span className="text-lg sm:text-xl flex-shrink-0">👍</span>
              <span><strong>Answer Upvote:</strong> +2 points</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
