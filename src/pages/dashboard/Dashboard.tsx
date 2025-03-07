import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import axios from '../../util/axios';
interface DashboardData {
  topPrompts: {
    _id: string;
    topicId: string;
    question_vi: string;
    question_en: string;
    view: number;
  }[];
}
interface Question {
  _id: string;
  topicId: string;
  questionContextDetails: {
    context: string;
    language: string;
  }[];
  usageCount: number;
}
const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState({
    newRegisterNumber: 0,
    totalRegisterNumber: 0,
    totalUserActiveNumber: 0,
  });
  const navigate = useNavigate();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');
    const refreshToken = urlParams.get('refreshToken');
    if (accessToken && refreshToken) {
      // Lưu các token vào localStorage
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      navigate('/'); // Ví dụ chuyển hướng đến trang dashboard
    }
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/authentication/sign-in', { replace: true });
    }
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/dashboard');
        const top10 = await axios.get(`/questions?page=1&limit=10`);
        setAuthenticated(response.data.result);
        const top10Response = {
          topPrompts: top10.data.result.items.map((item: Question) => {
            return {
              _id: item._id,
              topicId: item.topicId,
              question_vi: item.questionContextDetails[0].context,
              question_en: item.questionContextDetails[1].context,
              view: item?.usageCount || 0,
            };
          }),
        };
        setData(top10Response);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      <div className="stats-container">
        <div className="stat-item">
          <h2>New Registrations Today</h2>
          <p>{authenticated?.newRegisterNumber}</p>
        </div>

        <div className="stat-item">
          <h2>Total Registrations</h2>
          <p>{authenticated?.totalRegisterNumber}</p>
        </div>

        <div className="stat-item">
          <h2>Active Users</h2>
          <p>{authenticated?.totalUserActiveNumber}</p>
        </div>
      </div>

      <div className="top-prompts">
        <h2>Top 10 Prompts</h2>
        {data?.topPrompts?.length ? (
          <table>
            <thead>
              <tr>
                <th>Question VietNam</th>
                <th>Question English</th>
                <th>Topic ID</th>
                <th>Views</th>
              </tr>
            </thead>
            <tbody>
              {data.topPrompts.map((prompt) => (
                <tr key={prompt._id}>
                  <td>{prompt.question_vi}</td>
                  <td>{prompt.question_en}</td>
                  <td>{prompt.topicId}</td>
                  <td>{prompt.view}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No prompts available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
