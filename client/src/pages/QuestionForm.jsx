import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useSelector } from 'react-redux';

function QuestionForm() {
  const navigate = useNavigate();
  const { token } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📤 [QUESTION FORM] Submit button clicked');
    console.log('📤 [QUESTION FORM] Token present?', !!token);
    
    if (!token) {
      console.error('❌ [QUESTION FORM] No token, redirecting to login');
      setError('You must be logged in to ask a question');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      console.log('📤 [QUESTION FORM] Submitting question:', { 
        title: formData.title, 
        bodyLength: formData.body.length,
        tagsCount: tagsArray.length 
      });

      const response = await api.post('/questions', {
        title: formData.title,
        body: formData.body,
        tags: tagsArray
      });

      console.log('✅ [QUESTION FORM] Question created:', response.data);
      navigate(`/questions/${response.data._id}`);
    } catch (err) {
      console.error('❌ [QUESTION FORM] Submission failed');
      console.error('   Error message:', err.message);
      console.error('   Error response:', err.response?.data);
      console.error('   Error status:', err.response?.status);
      console.error('   Full error:', err);
      setError(err.response?.data?.msg || err.response?.data?.error || err.message || 'Failed to create question');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <Link to="/questions" className="text-blue-500 hover:text-blue-600 text-sm sm:text-base inline-flex items-center min-h-[44px]">
          ← Back to Questions
        </Link>
      </div>

      <div className="bg-white p-4 sm:p-8 rounded-lg sm:rounded-xl shadow-md border border-gray-100">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Ask a Question</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 sm:py-4 rounded-lg mb-6 text-sm sm:text-base">
            {error}
          </div>
        )}

        {!token && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 sm:py-4 rounded-lg mb-6 text-sm sm:text-base">
            You must be <Link to="/login" className="underline font-semibold">logged in</Link> to ask a question
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={!token}
              className="input text-base sm:text-sm"
              placeholder="What is your question?"
            />
            <p className="text-xs text-gray-500 mt-1">Be specific and concise</p>
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
              required
              disabled={!token}
              rows="8"
              className="input resize-none text-base sm:text-sm"
              placeholder="Provide more details about your question..."
            />
            <p className="text-xs text-gray-500 mt-1">Include what you've tried and error messages</p>
          </div>

          {/* Tags Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              disabled={!token}
              className="input text-base sm:text-sm"
              placeholder="e.g., React, JavaScript, Authentication"
            />
            <p className="text-xs text-gray-500 mt-1">Add up to 5 tags</p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || !token}
              className="btn btn-primary w-full sm:w-auto text-base sm:text-sm"
            >
              {loading ? 'Asking...' : 'Ask Question'}
            </button>
            <Link
              to="/questions"
              className="btn btn-secondary w-full sm:w-auto text-center text-base sm:text-sm"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuestionForm;
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuestionForm;
