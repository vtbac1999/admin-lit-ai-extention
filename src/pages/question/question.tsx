import React, { useState, useEffect } from 'react';
import { Table, Typography, Space, Spin, Empty, Button, Modal, notification } from 'antd';
import axios from '../../util/axios';
import { useLocation } from 'react-router-dom';
import QuestionComponent from 'theme/components/edit/edit-question';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CreateQuestionComponent from 'theme/components/edit/create-question';
interface QuestionContextDetail {
  context: string;
  language: string;
}

interface Question {
  _id: string;
  questionContextDetails: QuestionContextDetail[];
  isActive: boolean;
}

const QuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const topicId = params.get('topicId') || '';
  const name = params.get('name');
  const navigate = useNavigate();
  const userRole = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') || 'manager')
    : '';
  // Fetch dữ liệu câu hỏi từ API
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
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/questions', {
          params: {
            topicId: topicId,
            page: 1,
            limit: 50,
          },
        });

        if (Array.isArray(response.data.result.items)) {
          setQuestions(response.data.result.items);
        } else {
          setQuestions([]);
        }
      } catch (error) {
        setError('Lỗi khi lấy dữ liệu câu hỏi');
        console.error('Lỗi khi lấy dữ liệu câu hỏi', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [topicId]);

  const showEditModal = (question: Question) => {
    setEditQuestion(question);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditQuestion(null);
    setIsModalOpen(false);
    setIsModalOpenCreate(false);
  };

  const updateQuestion = async (updatedQuestion: Question) => {
    console.log(`🚀 ~ updatedQuestion:`, updatedQuestion);
    try {
      await axios.patch(`/questions/${updatedQuestion._id}`, updatedQuestion);
      notification.success({
        message: 'Thông báo',
        description: 'Cập nhật thông tin thành công',
      });

      // Cập nhật danh sách câu hỏi sau khi chỉnh sửa thành công
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) => (q._id === updatedQuestion._id ? { ...updatedQuestion } : q)),
      );
      handleCloseModal();
    } catch (error) {
      console.error('Lỗi khi cập nhật câu hỏi:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể cập nhật thông tin',
      });
    }
  };

  const columns = [
    {
      title: 'Context',
      dataIndex: 'questionContextDetails',
      key: 'context',
      render: (questionContextDetails: QuestionContextDetail[]) => (
        <Space direction="vertical">
          {questionContextDetails.map((detail, index) => (
            <div key={index}>
              <Typography.Text strong>Context:</Typography.Text> {detail.context}
              <br />
              <Typography.Text strong>Language:</Typography.Text> {detail.language}
            </div>
          ))}
        </Space>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_id: string, record: Question) => (
        <Space>
          {userRole.role === 'admin' && (
            <>
              <Button icon={<EditOutlined />} onClick={() => showEditModal(record)}>
                Edit
              </Button>
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleDeleteQuestion(record._id)}
              >
                Delete
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const handleDeleteQuestion = async (id: string) => {
    try {
      await axios.delete(`/questions/${id}`);
      notification.success({
        message: 'Thông báo',
        description: 'Xóa câu hỏi thành công',
      });
      setQuestions((prevQuestions) => prevQuestions.filter((q) => q._id !== id));
    } catch (error) {
      console.error('Lỗi khi xóa câu hỏi:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể xóa câu hỏi',
      });
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Typography.Text type="danger">{error}</Typography.Text>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Empty description="Không có câu hỏi nào" />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Danh Sách Câu Hỏi Về {name}</h1>
      {userRole.role === 'admin' && (
        <Button onClick={() => setIsModalOpenCreate(true)}>+ Create Question</Button>
      )}
      <Table columns={columns} dataSource={questions} rowKey="_id" pagination={false} />
      <Modal title="Chỉnh Sửa Câu Hỏi" open={isModalOpen} onCancel={handleCloseModal} footer={null}>
        {editQuestion && (
          <QuestionComponent question={editQuestion} updateQuestion={updateQuestion} />
        )}
      </Modal>
      <Modal
        title="Thêm Câu Hỏi"
        open={isModalOpenCreate}
        onCancel={handleCloseModal}
        footer={null}
      >
        {<CreateQuestionComponent topicId={topicId} createQuestion={updateQuestion} />}
      </Modal>
    </div>
  );
};

export default QuestionsPage;
