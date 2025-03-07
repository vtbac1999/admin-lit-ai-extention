import React from 'react';
import { Table, Typography, Button } from 'antd';

const { Text } = Typography;

interface TopicContextDetail {
  name: string;
  description: string;
  language: string;
}

interface Topic {
  _id: string;
  image: string;
  topicContextDetails: TopicContextDetail[];
}

interface TopicTableProps {
  selectedTopic: Topic[];
  showQuestions: (id: string, name: string) => void;
}

const TopicTable: React.FC<TopicTableProps> = ({ selectedTopic, showQuestions }) => {
  const columns = [
    {
      title: 'Topic ID',
      dataIndex: '_id',
      key: '_id',
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => (
        <img
          src={image}
          alt="Hình ảnh chủ đề"
          style={{
            width: '100%',
            maxWidth: '150px',
            height: 'auto',
            objectFit: 'cover',
            borderRadius: '5px',
          }}
        />
      ),
    },
    {
      title: 'Details',
      dataIndex: 'topicContextDetails',
      key: 'topicContextDetails',
      render: (details: TopicContextDetail[]) => (
        <div>
          {details.map((detail, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <Text strong>Name:</Text> {detail.name}
              <br />
              <Text strong>Description:</Text> {detail.description}
              <br />
              <Text strong>Language:</Text> {detail.language}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_id: string, topic: Topic) => (
        <Button
          type="primary"
          onClick={() => showQuestions(topic._id, topic.topicContextDetails[0]?.name || '')}
        >
          Show Questions
        </Button>
      ),
    },
  ];

  return (
    <Table
      dataSource={selectedTopic}
      columns={columns}
      rowKey="_id"
      bordered
      style={{ width: '100%' }}
    />
  );
};

export default TopicTable;
