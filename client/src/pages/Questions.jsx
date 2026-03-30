import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      console.log('%c📄 Questions: Starting fetch', 'color: purple; font-weight: bold;');
      try {
        console.log('Fetching from endpoint: /questions');
        const response = await api.get('/questions');
        console.log('%c✅ Questions: Fetch successful', 'color: green; font-weight: bold;', {
          count: response.data.length,
          data: response.data
        });
        setQuestions(response.data);
        setLoading(false);
      } catch (err) {
        console.error('%c❌ Questions: Fetch failed', 'color: red; font-weight: bold;', {
          error: err.message,
          errorObject: err
        });
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) {
    return (
      <div className="w-full">
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading questions...</p>
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

  return (
    <div className="w-full">
      {/* Header with CTA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Questions & Answers</h1>
        <Link 
          to="/questions/new"
          className="w-full sm:w-auto bg-blue-500 text-white px-6 py-3 sm:py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-sm hover:shadow text-center min-h-[44px] sm:min-h-auto flex items-center justify-center text-base sm:text-sm"
        >
          Ask a Question
        </Link>
      </div>
      
      {/* Questions List */}
      <div className="space-y-4 sm:space-y-6">
        {questions.length === 0 ? (
          <div className="bg-white p-8 sm:p-12 rounded-lg sm:rounded-2xl shadow-md text-center border border-gray-100">
            <svg className="w-12 sm:w-16 h-12 sm:h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">No questions have been asked yet.</p>
            <Link
              to="/questions/new"
              className="text-blue-500 hover:text-blue-600 font-medium text-sm sm:text-base inline-block px-4 py-2 sm:py-3 min-h-[44px] sm:min-h-auto flex items-center"
            >
              Be the first to ask a question!
            </Link>
          </div>
        ) : (
          questions.map((question) => (
            <div 
              key={question._id}
              className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100"
            >
              <Link to={`/questions/${question._id}`} className="block group">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {question.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2 text-sm sm:text-base">{question.body}</p>
                
                {/* Stats and Tags */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500">
                    <span className="flex items-center gap-1 min-h-[44px] sm:min-h-auto sm:py-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {question.views} views
                    </span>
                    <span className="flex items-center gap-1 min-h-[44px] sm:min-h-auto sm:py-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {question.answers?.length || 0} answers
                    </span>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {question.tags.slice(0, 3).map((tag) => (
                      <span 
                        key={tag}
                        className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {question.tags.length > 3 && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                        +{question.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Questions;
            </Link>
          </div>
        ) : (
          questions.map((question) => (
            <div 
              key={question._id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100"
            >
              <Link to={`/questions/${question._id}`} className="block">
                <h2 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600">
                  {question.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{question.body}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {question.views} views
                    </span>
                    <span className="text-gray-500 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {question.answers?.length || 0} answers
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {question.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Questions;
