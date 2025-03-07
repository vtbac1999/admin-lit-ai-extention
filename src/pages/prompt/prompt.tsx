import React, { useEffect, useState } from 'react';
import { Button, Space, Table, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'util/axios';
import EditTopicForm from 'theme/components/edit/edit-topic';
import CreateTopicForm from 'theme/components/edit/create-topic';

const { Text, Title } = Typography;

interface Context {
  name: string;
  description: string;
  language: string;
}

interface Subcategory {
  _id: string;
  contexts: Context[];
  image: string;
  visible: boolean;
}

interface TopicContextDetails {
  name: string;
  description: string;
  language: string;
}

interface Topic {
  topicContextDetails: TopicContextDetails[];
  _id: string;
  image: string;
}

const SubcategoryManager: React.FC = () => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [topics, setTopics] = useState<Record<string, Topic[]>>({});
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const navigate = useNavigate();

  const userRole = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') || 'manager')
    : '';

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');
    const refreshToken = urlParams.get('refreshToken');

    if (accessToken && refreshToken) {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      navigate('/');
    }

    if (!localStorage.getItem('access_token')) {
      navigate('/authentication/sign-in', { replace: true });
    } else {
      fetchCategories();
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/categories?page=1&limit=100');
      setSubcategories(data.result.items);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  const callApi = async (subcategoryId: string) => {
    try {
      const { data } = await axios.get(`/topics?categoryId=${subcategoryId}`);
      setTopics((prev) => ({
        ...prev,
        [subcategoryId]: data.result.items,
      }));
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };
  const toggleExpand = async (subcategoryId: string) => {
    const isExpanded = expandedRows.includes(subcategoryId);

    if (isExpanded) {
      setExpandedRows(expandedRows.filter((id) => id !== subcategoryId));
    } else {
      setExpandedRows([...expandedRows, subcategoryId]);

      if (!topics[subcategoryId]) {
        callApi(subcategoryId);
      }
    }
  };

  const handleEditTopic = (topic: Topic) => {
    setEditingTopic(topic);
    setIsEditModalVisible(true);
  };

  const handleDeleteTopic = async (subcategoryId: string, topicId: string) => {
    try {
      await axios.delete(`/topics/${topicId}`);
      setTopics((prev) => ({
        ...prev,
        [subcategoryId]: prev[subcategoryId]?.filter((topic) => topic._id !== topicId) || [],
      }));
      message.success('Topic deleted successfully');
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  const handleCreateTopic = (subcategoryId: string) => {
    setSelectedCategoryId(subcategoryId);
    setIsCreateModalVisible(true);
  };

  const handleModalClose = () => {
    setIsEditModalVisible(false);
    setIsCreateModalVisible(false);
    setEditingTopic(null);
  };
  const handleSaveTopic = () => {
    callApi(selectedCategoryId);

    message.success('Topic saved successfully');
    handleModalClose();
  };
  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (src: string) => (
        <img src={src} alt="Subcategory" style={{ width: 50, height: 50, borderRadius: '4px' }} />
      ),
    },
    {
      title: 'Subcategory ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Contexts',
      dataIndex: 'contexts',
      key: 'contexts',
      render: (contexts: Context[]) =>
        contexts.map((context) => (
          <div key={context.name} style={{ marginBottom: '8px' }}>
            <Text strong>{context.name}</Text> ({context.language}): {context.description}
          </div>
        )),
    },
    {
      title: 'Visibility',
      dataIndex: 'visible',
      key: 'visible',
      render: (visible: boolean) => (visible ? 'Visible' : 'Hidden'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, record: Subcategory) => (
        <Button icon={<EyeOutlined />} onClick={() => toggleExpand(record._id)}>
          {expandedRows.includes(record._id) ? 'Hide' : 'Show'}
        </Button>
      ),
    },
  ];

  const expandedRowRender = (subcategoryId: string) => {
    const topicList = topics[subcategoryId] || [];

    if (!topicList.length) {
      return <Text>No topics available</Text>;
    }

    return (
      <div style={{ padding: '16px' }}>
        <Title level={5}>Topics</Title>
        {userRole.role === 'admin' && (
          <Button onClick={() => handleCreateTopic(subcategoryId)}>+ Create Topic</Button>
        )}
        <Table
          dataSource={topicList}
          columns={[
            {
              title: 'Topic ID',
              dataIndex: '_id',
              key: '_id',
            },
            {
              title: 'Image',
              dataIndex: 'image',
              key: 'image',
              render: (src: string) => (
                <img
                  src={src}
                  alt="Topic"
                  style={{ width: '50px', height: '50px', borderRadius: '4px' }}
                />
              ),
            },
            {
              title: 'Details',
              key: 'details',
              render: (_: unknown, topic: Topic) =>
                topic.topicContextDetails.map((detail, index) => (
                  <div key={index} style={{ marginBottom: '8px' }}>
                    <Text strong>Name:</Text> {detail.name}
                    <br />
                    <Text strong>Description:</Text> {detail.description}
                    <br />
                    <Text strong>Language:</Text> {detail.language}
                  </div>
                )),
            },
            {
              title: 'Action',
              key: 'action',
              render: (_: unknown, topic: Topic) => (
                <Space>
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/question?topicId=${topic._id}`)}
                  >
                    Show
                  </Button>
                  {userRole.role === 'admin' && (
                    <>
                      <Button icon={<EditOutlined />} onClick={() => handleEditTopic(topic)}>
                        Edit
                      </Button>
                      <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDeleteTopic(subcategoryId, topic._id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </Space>
              ),
            },
          ]}
          rowKey="_id"
          pagination={false}
        />
      </div>
    );
  };

  return (
    <div className="subcategory-manager">
      <Title level={2}>Subcategory Manager</Title>
      <Table
        columns={columns}
        dataSource={subcategories}
        rowKey="_id"
        expandedRowRender={(record) => expandedRowRender(record._id)}
        expandedRowKeys={expandedRows}
        onExpand={(expanded, record) => toggleExpand(record._id)}
        pagination={false}
        bordered
      />
      {isEditModalVisible && (
        <EditTopicForm
          visible={isEditModalVisible}
          onClose={() => handleModalClose()}
          topic={editingTopic}
          onSave={handleSaveTopic}
        />
      )}
      <CreateTopicForm
        visible={isCreateModalVisible}
        onClose={() => handleModalClose()}
        topic={selectedCategoryId}
        onSave={handleSaveTopic}
      />
      ;
    </div>
  );
};

export default SubcategoryManager;
