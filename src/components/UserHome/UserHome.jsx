import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Spinner from '../Spinner/Spinner';
import api from '../../utils/api';

const UserHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();  // Do NOT call login() here – avoid infinite loop
  const { showToast } = useToast();

  const [stats, setStats] = useState({
    totalInterviews: 0,
    avgScore: 0,
    bestScore: 0,
    creditsLeft: user?.creditsRemaining || 0,
  });
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false); // prevent duplicate fetches

  // ✅ Guard: if user is not yet loaded, show spinner
  if (!user) return <Spinner />;

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    let didCancel = false;

    const fetchUserData = async () => {
      try {
        const [profileRes, interviewsRes] = await Promise.all([
          api.get('/user/profile'),
          api.get('/interview/user/all'),
        ]);

        if (didCancel) return;

        const freshUser = profileRes.data;
        const interviews = interviewsRes.data || [];
        const total = interviews.length;
        const scores = interviews.map((i) => i.overallScore || 0);
        const avg = total > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / total) : 0;
        const best = total > 0 ? Math.max(...scores) : 0;

        setStats({
          totalInterviews: total,
          avgScore: avg,
          bestScore: best,
          creditsLeft: freshUser.creditsRemaining || 0,
        });
        setRecentInterviews(interviews.slice(0, 3));
      } catch (err) {
        if (!didCancel) {
          console.error('Failed to load user home data:', err);
          showToast('Could not load your dashboard data', 'error');
        }
      } finally {
        if (!didCancel) setLoading(false);
      }
    };

    fetchUserData();
    return () => {
      didCancel = true;
    };
  }, []); // ✅ Empty dependency – runs only once

  if (loading) return <Spinner />;

  const firstName = user?.name?.split(' ')[0] || 'User';
  const hasResume = user?.profile?.resumeParsed || false;

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400 bg-green-400/10';
    if (score >= 50) return 'text-yellow-400 bg-yellow-400/10';
    return 'text-red-400 bg-red-400/10';
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'text':
        return '📝';
      case 'voice':
        return '🎤';
      case 'video':
        return '📹';
      default:
        return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Welcome back, <span className="bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] bg-clip-text text-transparent">{firstName}</span> 👋
          </h1>
          <p className="text-[#9ca3af] text-lg">
            {stats.totalInterviews === 0
              ? 'Ready to practice your first interview?'
              : `You've taken ${stats.totalInterviews} interview${stats.totalInterviews > 1 ? 's' : ''}. Keep practicing!`}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-[#13131a] border border-[#2d2d3d] rounded-xl p-6 hover:border-purple-500 transition">
            <p className="text-[#9ca3af] text-sm mb-2">Interviews Taken</p>
            <p className="text-4xl font-bold text-white">{stats.totalInterviews}</p>
            <p className="text-[#6b7280] text-xs mt-2">Total completed</p>
          </div>

          <div className="bg-[#13131a] border border-[#2d2d3d] rounded-xl p-6 hover:border-purple-500 transition">
            <p className="text-[#9ca3af] text-sm mb-2">Average Score</p>
            <p className="text-4xl font-bold text-white">
              {stats.avgScore}
              <span className="text-xl text-[#9ca3af]">%</span>
            </p>
            <p className="text-[#6b7280] text-xs mt-2">Based on all interviews</p>
          </div>

          <div className="bg-[#13131a] border border-[#2d2d3d] rounded-xl p-6 hover:border-purple-500 transition">
            <p className="text-[#9ca3af] text-sm mb-2">Credits Left</p>
            <p className="text-4xl font-bold text-white">{stats.creditsLeft}</p>
            <p className="text-[#6b7280] text-xs mt-2">
              <Link to="/plans" className="text-purple-400 hover:underline">Buy more</Link>
            </p>
          </div>

          <div className="bg-[#13131a] border border-[#2d2d3d] rounded-xl p-6 hover:border-purple-500 transition">
            <p className="text-[#9ca3af] text-sm mb-2">Best Score</p>
            <p className="text-4xl font-bold text-white">
              {stats.bestScore}
              <span className="text-xl text-[#9ca3af]">%</span>
            </p>
            <p className="text-[#6b7280] text-xs mt-2">Highest achievement</p>
          </div>
        </div>

        {/* Recent Interviews */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Recent Interviews</h2>
          {recentInterviews.length === 0 ? (
            <div className="bg-[#13131a] border border-[#2d2d3d] rounded-xl p-8 text-center">
              <p className="text-[#9ca3af] mb-4">You haven't taken any interviews yet.</p>
              <Link
                to="/dashboard"
                className="inline-block px-6 py-2 bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] rounded-lg text-white font-semibold hover:scale-105 transition"
              >
                🚀 Start Your First Interview
              </Link>
            </div>
          ) : (
            <div className="bg-[#13131a] border border-[#2d2d3d] rounded-xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-[#2d2d3d] bg-[#0f0f15]">
                  <tr>
                    <th className="px-4 py-3 text-left text-[#9ca3af]">Date</th>
                    <th className="px-4 py-3 text-left text-[#9ca3af]">Category</th>
                    <th className="px-4 py-3 text-left text-[#9ca3af]">Mode</th>
                    <th className="px-4 py-3 text-left text-[#9ca3af]">Score</th>
                    <th className="px-4 py-3 text-left text-[#9ca3af]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInterviews.map((interview) => (
                    <tr key={interview._id} className="border-b border-[#2d2d3d] hover:bg-[#0f0f15] transition">
                      <td className="px-4 py-3 text-white">
                        {new Date(interview.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-[#e5e7eb]">
                        {interview.category?.charAt(0).toUpperCase() + interview.category?.slice(1)}
                      </td>
                      <td className="px-4 py-3 text-white">
                        {getModeIcon(interview.mode)} {interview.mode?.charAt(0).toUpperCase() + interview.mode?.slice(1)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-lg font-semibold ${getScoreColor(interview.overallScore || 0)}`}>
                          {interview.overallScore || 0}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => navigate(`/results/${interview._id}`)}
                          className="text-purple-400 hover:text-purple-300 underline text-sm transition"
                        >
                          View Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gradient-to-br from-[#13131a] to-[#0f0f15] border border-[#2d2d3d] rounded-xl p-8 hover:border-purple-500 transition">
            <h3 className="text-xl font-bold mb-2">Start New Interview</h3>
            <p className="text-[#9ca3af] text-sm mb-4">Customize difficulty, mode, and topic for targeted practice.</p>
            <Link
              to="/dashboard"
              className="inline-block px-4 py-2 bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] rounded-lg text-white font-semibold hover:scale-105 transition"
            >
              Go to Dashboard →
            </Link>
          </div>

          {!hasResume && (
            <div className="bg-gradient-to-br from-[#13131a] to-[#0f0f15] border border-[#2d2d3d] rounded-xl p-8 hover:border-purple-500 transition">
              <h3 className="text-xl font-bold mb-2">📄 Upload Your Resume</h3>
              <p className="text-[#9ca3af] text-sm mb-4">Get personalized questions based on your experience and skills.</p>
              <Link
                to="/settings"
                className="inline-block px-4 py-2 bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] rounded-lg text-white font-semibold hover:scale-105 transition"
              >
                Upload Resume →
              </Link>
            </div>
          )}

          {hasResume && (
            <div className="bg-gradient-to-br from-[#13131a] to-[#0f0f15] border border-[#2d2d3d] rounded-xl p-8 hover:border-purple-500 transition">
              <h3 className="text-xl font-bold mb-2">⚙️ Manage Resume</h3>
              <p className="text-[#9ca3af] text-sm mb-4">Update or re-upload your resume for better personalization.</p>
              <Link
                to="/settings"
                className="inline-block px-4 py-2 bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] rounded-lg text-white font-semibold hover:scale-105 transition"
              >
                View Settings →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHome;