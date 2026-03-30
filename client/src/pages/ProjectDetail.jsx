import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        console.log(`📦 Fetching project with ID: ${id}`);
        const response = await api.get(`/projects/${id}`);
        console.log('✅ Project fetched:', response.data);
        setProject(response.data);
        setLoading(false);
      } catch (err) {
        console.error('❌ Failed to fetch project:', err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link to="/projects" className="text-blue-500 hover:text-blue-600 mb-4 inline-block">← Back to Projects</Link>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link to="/projects" className="text-blue-500 hover:text-blue-600 mb-4 inline-block">← Back to Projects</Link>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600">Project not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/projects" className="text-blue-500 hover:text-blue-600 mb-6 inline-block">← Back to Projects</Link>
      
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
        
        <div className="flex items-center mb-6 text-gray-500 text-sm">
          <span>By: {project.author?.name || 'Anonymous'}</span>
          <span className="mx-2">•</span>
          <span>👍 {project.likes?.length || 0} Likes</span>
        </div>

        <div className="prose prose-blue max-w-none mb-8">
          <p className="text-gray-700 text-lg">{project.description}</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <div className="grid grid-cols-2 gap-4">
            {project.githubLink && (
              <div>
                <p className="text-sm text-gray-600 mb-2">GitHub Repository</p>
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 break-all">
                  {project.githubLink}
                </a>
              </div>
            )}
            {project.liveLink && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Live Demo</p>
                <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 break-all">
                  {project.liveLink}
                </a>
              </div>
            )}
          </div>
        </div>

        {project.techStack && project.techStack.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map(tech => (
                <span key={tech} className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {project.comments && project.comments.length > 0 && (
          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-4">Comments ({project.comments.length})</h3>
            <div className="space-y-4">
              {project.comments.map((comment, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-2">{comment.body}</p>
                  <p className="text-sm text-gray-500">By: {comment.author?.name || 'Anonymous'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetail;
