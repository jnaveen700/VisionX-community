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
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600">User data not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Profile Header */}
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {userData.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{userData.name || 'User'}</h1>
            <p className="text-gray-600 capitalize">{userData.role || 'Member'}</p>
            <p className="text-sm text-gray-500">{userData.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-sm border border-blue-200">
            <div className="text-4xl font-bold text-blue-600">{userData.points || 0}</div>
            <h3 className="font-semibold text-gray-700 mt-2">Reward Points</h3>
            <p className="text-xs text-gray-600 mt-1">Ask: 5pt • Answer: 10pt • Accepted: 25pt • Upvote: 2pt</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-sm border border-green-200">
            <div className="text-4xl font-bold text-green-600">0</div>
            <h3 className="font-semibold text-gray-700 mt-2">Questions Asked</h3>
            <p className="text-xs text-gray-600 mt-1">Share your knowledge</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow-sm border border-purple-200">
            <div className="text-4xl font-bold text-purple-600">0</div>
            <h3 className="font-semibold text-gray-700 mt-2">Projects Shared</h3>
            <p className="text-xs text-gray-600 mt-1">Showcase your work</p>
          </div>
        </div>

        {/* Bio Section */}
        {userData.bio && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-3">About Me</h2>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{userData.bio}</p>
          </div>
        )}

        {/* Skills Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3">Skills</h2>
          {userData.skills && userData.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userData.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No skills added yet. Update your profile to add skills!</p>
          )}
        </div>

        {/* Badges Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Badges</h2>
          {userData.badges && userData.badges.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {userData.badges.map((badge, idx) => (
                <div key={idx} className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                  <div className="text-3xl mb-2">🏆</div>
                  <p className="font-semibold text-sm text-gray-700">{badge.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-2">🎯 No badges yet!</p>
              <p className="text-sm text-gray-500">
                Keep answering questions and earning points to unlock badges!
              </p>
            </div>
          )}
        </div>

        {/* Points Breakdown */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">How to Earn Points</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div className="flex items-center gap-2">
              <span className="text-lg">❓</span>
              <span><strong>Ask a Question:</strong> +5 points</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">💬</span>
              <span><strong>Answer a Question:</strong> +10 points</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">✅</span>
              <span><strong>Accepted Answer:</strong> +25 points</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">👍</span>
              <span><strong>Answer Upvote:</strong> +2 points</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
