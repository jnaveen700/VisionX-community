import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        console.log(`📄 Fetching question with ID: ${id}`);
        const response = await api.get(`/questions/${id}`);
        console.log('✅ Question fetched:', response.data);
        setQuestion(response.data);
        setLoading(false);
      } catch (err) {
        console.error('❌ Failed to fetch question:', err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link to="/questions" className="text-blue-500 hover:text-blue-600 mb-4 inline-block">← Back to Questions</Link>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link to="/questions" className="text-blue-500 hover:text-blue-600 mb-4 inline-block">← Back to Questions</Link>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600">Question not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/questions" className="text-blue-500 hover:text-blue-600 mb-6 inline-block">← Back to Questions</Link>
      
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">{question.title}</h1>
        
        <div className="flex items-center mb-6 text-gray-500 text-sm">
          <span>Asked by: {question.author?.name || 'Anonymous'}</span>
          <span className="mx-2">•</span>
          <span>Views: {question.views || 0}</span>
          <span className="mx-2">•</span>
          <span>Answers: {question.answers?.length || 0}</span>
        </div>

        <div className="prose prose-blue max-w-none mb-8">
          <p className="text-gray-700 text-lg">{question.body}</p>
        </div>

        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {question.tags.map(tag => (
              <span key={tag} className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">Answers ({question.answers?.length || 0})</h2>
          
          {question.answers && question.answers.length > 0 ? (
            <div className="space-y-6">
              {question.answers.map((answer, idx) => (
                <div key={idx} className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 mb-4">{answer.body}</p>
                  <div className="text-sm text-gray-500">
                    <span>By: {answer.author?.name || 'Anonymous'}</span>
                    {answer.isAccepted && <span className="ml-2 text-green-600">✅ Accepted Answer</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No answers yet. Be the first to answer!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuestionDetail;
