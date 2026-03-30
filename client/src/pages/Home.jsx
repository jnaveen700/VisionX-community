import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import api from '../utils/api';

function Home() {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useSelector(state => state.auth);
  const [questions, setQuestions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localToken = localStorage.getItem('token');
    console.log('🏠 [HOME PAGE] Auth State Check:');
    console.log('   Redux token:', !!token);
    console.log('   Redux isAuthenticated:', isAuthenticated);
    console.log('   localStorage token:', !!localToken);
    console.log('   Token length:', token?.length || 0);
  }, [token, isAuthenticated]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionsRes, projectsRes] = await Promise.all([
          api.get('/questions'),
          api.get('/projects')
        ]);
        setQuestions(questionsRes.data.slice(0, 3));
        setProjects(projectsRes.data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching home data:', err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);
  
  const handleAskQuestion = () => {
    console.log('🔘 Ask a Question clicked');
    navigate('/questions/new');
  };
  
  const handleShareProject = () => {
    console.log('🔘 Share Project clicked');
    navigate('/projects/new');
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-16 bg-gradient-to-br from-white to-blue-50 p-12 rounded-2xl shadow-lg border border-blue-100">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              VisionX
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-2 leading-relaxed">Developer Community Platform</p>
          <p className="text-lg text-gray-500 mb-10 leading-relaxed">
            Share knowledge, ask questions, showcase projects, and grow together
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={handleAskQuestion}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
            >
              ❓ Ask a Question
            </button>
            <button 
              onClick={handleShareProject}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
            >
              🚀 Share a Project
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Latest Questions */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                <span className="text-3xl mr-3">❓</span>
                Latest Questions
              </h2>
              <p className="text-gray-500 text-sm mt-1">{questions.length} questions available</p>
            </div>
            <Link to="/questions" className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-4 py-2 rounded-lg font-semibold transition-colors">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-3 border-solid border-blue-500 border-r-transparent"></div>
                <p className="mt-3 text-gray-500">Loading questions...</p>
              </div>
            ) : questions.length > 0 ? (
              questions.map(question => (
                <Link 
                  key={question._id}
                  to={`/questions/${question._id}`}
                  className="p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-lg hover:from-blue-100 cursor-pointer transition-all duration-200 border border-blue-100 hover:border-blue-300 block group"
                >
                  <h3 className="text-gray-800 font-semibold mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">{question.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">👁️ {question.views || 0} views</span>
                    <span className="flex items-center gap-1">💬 {question.answers?.length || 0} answers</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No questions yet</p>
                <p className="text-gray-400 text-sm mt-2">Be the first to ask a question!</p>
              </div>
            )}
          </div>
        </div>

        {/* Featured Projects */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                <span className="text-3xl mr-3">🚀</span>
                Featured Projects
              </h2>
              <p className="text-gray-500 text-sm mt-1">{projects.length} projects showcase</p>
            </div>
            <Link to="/projects" className="bg-purple-100 text-purple-600 hover:bg-purple-200 px-4 py-2 rounded-lg font-semibold transition-colors">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-3 border-solid border-purple-500 border-r-transparent"></div>
                <p className="mt-3 text-gray-500">Loading projects...</p>
              </div>
            ) : projects.length > 0 ? (
              projects.map(project => (
                <Link 
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="p-4 bg-gradient-to-r from-purple-50 to-transparent rounded-lg hover:from-purple-100 cursor-pointer transition-all duration-200 border border-purple-100 hover:border-purple-300 block group"
                >
                  <h3 className="text-gray-800 font-semibold mb-2 group-hover:text-purple-600 transition-colors line-clamp-1">{project.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.slice(0, 3).map(tech => (
                      <span key={tech} className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 3 && (
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
                        +{project.techStack.length - 3}
                      </span>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No projects yet</p>
                <p className="text-gray-400 text-sm mt-2">Share your first project with the community!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl shadow-lg">
        <div className="text-center">
          <div className="text-4xl font-bold">{questions.length}</div>
          <p className="text-blue-100 mt-2">Questions</p>
        </div>
        <div className="text-center border-l border-r border-blue-400">
          <div className="text-4xl font-bold">{projects.length}</div>
          <p className="text-blue-100 mt-2">Projects</p>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold">∞</div>
          <p className="text-blue-100 mt-2">Learning</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
