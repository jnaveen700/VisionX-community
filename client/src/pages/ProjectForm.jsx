import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useSelector } from 'react-redux';

function ProjectForm() {
  const navigate = useNavigate();
  const { token } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubLink: '',
    liveLink: '',
    techStack: ''
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
    console.log('📤 [PROJECT FORM] Submit button clicked');
    console.log('📤 [PROJECT FORM] Token present?', !!token);
    
    if (!token) {
      console.error('❌ [PROJECT FORM] No token, cannot submit');
      setError('You must be logged in to share a project');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const techStackArray = formData.techStack
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0);

      console.log('📤 [PROJECT FORM] Submitting project:', { 
        title: formData.title, 
        descLength: formData.description.length,
        techCount: techStackArray.length 
      });

      const response = await api.post('/projects', {
        title: formData.title,
        description: formData.description,
        githubLink: formData.githubLink,
        liveLink: formData.liveLink,
        techStack: techStackArray
      });

      console.log('✅ [PROJECT FORM] Project created:', response.data);
      navigate(`/projects/${response.data._id}`);
    } catch (err) {
      console.error('❌ [PROJECT FORM] Submission failed');
      console.error('   Error message:', err.message);
      console.error('   Error response:', err.response?.data);
      console.error('   Error status:', err.response?.status);
      console.error('   Full error:', err);
      setError(err.response?.data?.msg || err.response?.data?.error || err.message || 'Failed to create project');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link to="/projects" className="text-blue-500 hover:text-blue-600">← Back to Projects</Link>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Share a Project</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {!token && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-6">
            You must be <Link to="/login" className="underline font-semibold">logged in</Link> to share a project
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={!token}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="Name of your project"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={!token}
              rows="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="Describe your project, features, and technologies used..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GitHub Repository Link
            </label>
            <input
              type="url"
              name="githubLink"
              value={formData.githubLink}
              onChange={handleChange}
              disabled={!token}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="https://github.com/username/project"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Live Demo Link
            </label>
            <input
              type="url"
              name="liveLink"
              value={formData.liveLink}
              onChange={handleChange}
              disabled={!token}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="https://your-project-demo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tech Stack (comma-separated)
            </label>
            <input
              type="text"
              name="techStack"
              value={formData.techStack}
              onChange={handleChange}
              disabled={!token}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="e.g., React, Node.js, MongoDB, Tailwind CSS"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || !token}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Sharing...' : 'Share Project'}
            </button>
            <Link
              to="/projects"
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectForm;
