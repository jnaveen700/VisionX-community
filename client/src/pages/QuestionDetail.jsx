import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../utils/api';

function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useSelector(state => state.auth);
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answerBody, setAnswerBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setSubmitError('Please login to submit an answer');
      return;
    }

    if (!answerBody.trim()) {
      setSubmitError('Please write an answer');
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);
      console.log('📤 Submitting answer...');
      
      const response = await api.post(`/questions/${id}/answers`, {
        body: answerBody.trim()
      });
      
      console.log('✅ Answer submitted:', response.data);
      setQuestion(prev => ({
        ...prev,
        answers: response.data
      }));
      setAnswerBody('');
    } catch (err) {
      console.error('❌ Error submitting answer:', err.message);
      setSubmitError(err.response?.data?.msg || 'Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvoteAnswer = async (answerIndex) => {
    if (!token) {
      setSubmitError('Please login to upvote');
      return;
    }

    try {
      console.log(`⭐ Upvoting answer ${answerIndex}...`);
      const response = await api.put(`/questions/${id}/answers/upvote`, {
        answerIndex
      });
      console.log('✅ Answer upvoted:', response.data);
      setQuestion(prev => ({
        ...prev,
        answers: response.data
      }));
    } catch (err) {
      console.error('❌ Error upvoting answer:', err.message);
      setSubmitError(err.response?.data?.msg || 'Failed to upvote');
    }
  };

  const handleAcceptAnswer = async (answerIndex) => {
    if (!token) {
      setSubmitError('Please login to accept answer');
      return;
    }

    try {
      console.log(`✅ Accepting answer ${answerIndex}...`);
      const response = await api.put(`/questions/${id}/answers/accept`, {
        answerIndex
      });
      console.log('✅ Answer accepted:', response.data);
      setQuestion(prev => ({
        ...prev,
        answers: response.data
      }));
    } catch (err) {
      console.error('❌ Error accepting answer:', err.message);
      setSubmitError(err.response?.data?.msg || 'Failed to accept answer');
    }
  };

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
          <span>Asked by: <strong>{question.author?.name || 'Anonymous'}</strong></span>
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
            <div className="space-y-6 mb-8">
              {question.answers.map((answer, idx) => (
                <div key={idx} className={`p-6 rounded-lg ${answer.isAccepted ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'}`}>
                  {answer.isAccepted && <div className="text-green-600 font-bold mb-2">✅ Accepted Answer</div>}
                  <p className="text-gray-700 mb-4">{answer.body}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span>By: <strong>{answer.author?.name || 'Anonymous'}</strong></span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpvoteAnswer(idx)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          answer.upvotes?.includes(user?.id) || false
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        👍 {answer.upvotes?.length || 0}
                      </button>
                      {token && question.author?._id === user?.id && !answer.isAccepted && (
                        <button
                          onClick={() => handleAcceptAnswer(idx)}
                          className="px-3 py-1 rounded text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
                        >
                          ✓ Accept Answer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 mb-8">No answers yet. Be the first to answer!</p>
          )}

          {/* Answer Form */}
          <div className="border-t pt-8">
            <h3 className="text-xl font-bold mb-4">Your Answer</h3>
            {!token ? (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-blue-600">Please <Link to="/login" className="font-bold underline">login</Link> to submit an answer and earn <strong>10 points</strong>!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitAnswer} className="space-y-4">
                {submitError && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-red-600">{submitError}</p>
                  </div>
                )}
                <textarea
                  value={answerBody}
                  onChange={(e) => setAnswerBody(e.target.value)}
                  placeholder="Write your answer here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="6"
                  disabled={submitting}
                />
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Earn <strong>10 points</strong> for answering! <strong>25 points</strong> if marked as accepted!
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  >
                    {submitting ? 'Submitting...' : 'Submit Answer'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionDetail;
