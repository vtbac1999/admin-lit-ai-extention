import { Button, Form, Input, List, Typography } from 'antd';
import React from 'react';

interface Question {
  _id: string;
  questionContextDetails: {
    context: string;
    language: string;
  }[];
  isActive: boolean;
  topicId: string;
}

interface QuestionComponentProps {
  topicId: string;
  createQuestion: (createQuestion: Question) => void;
}

const CreateQuestionComponent: React.FC<QuestionComponentProps> = ({ topicId, createQuestion }) => {
  const [createdQuestion, setCreateQuestion] = React.useState<Question>({
    _id: '',
    questionContextDetails: [],
    isActive: false,
    topicId: topicId,
  });

  const handleSave = () => {
    createQuestion(createdQuestion);
  };

  const addContextDetail = () => {
    setCreateQuestion((prev) => ({
      ...prev,
      questionContextDetails: [...prev.questionContextDetails, { context: '', language: '' }],
    }));
  };

  return (
    <Form layout="vertical">
      {/* Input trạng thái */}
      <Form.Item label="Status">
        <Input
          value={createdQuestion.isActive ? 'Active' : ''}
          placeholder="Enter status (Active/Inactive)"
          onChange={(e) =>
            setCreateQuestion((prev) => ({
              ...prev,
              isActive: e.target.value.toLowerCase() === 'active',
            }))
          }
        />
      </Form.Item>

      {/* Input chi tiết ngữ cảnh */}
      <Form.Item label="Context Details">
        {createdQuestion.questionContextDetails.length === 0 ? (
          <div style={{ marginBottom: 16 }}>
            <Typography.Text strong>Language:</Typography.Text>
            <Input
              value=""
              placeholder="Enter language"
              onChange={(e) =>
                setCreateQuestion((prev) => ({
                  ...prev,
                  questionContextDetails: [
                    {
                      context: '',
                      language: e.target.value,
                    },
                  ],
                }))
              }
              style={{ marginBottom: 8 }}
            />
            <Typography.Text strong>Context:</Typography.Text>
            <Input
              value=""
              placeholder="Enter context"
              onChange={(e) =>
                setCreateQuestion((prev) => {
                  const updatedDetails = [
                    ...(prev.questionContextDetails.length > 0
                      ? prev.questionContextDetails
                      : [{ language: '', context: '' }]),
                  ];
                  updatedDetails[0] = { ...updatedDetails[0], context: e.target.value };
                  return { ...prev, questionContextDetails: updatedDetails };
                })
              }
            />
          </div>
        ) : (
          <List
            dataSource={createdQuestion.questionContextDetails}
            renderItem={(detail, index) => (
              <div key={index} style={{ marginBottom: 16 }}>
                <Typography.Text strong>Language:</Typography.Text>
                <Input
                  value={detail.language}
                  placeholder="Enter language"
                  onChange={(e) =>
                    setCreateQuestion((prev) => {
                      const updatedDetails = [...prev.questionContextDetails];
                      updatedDetails[index] = {
                        ...updatedDetails[index],
                        language: e.target.value,
                      };
                      return { ...prev, questionContextDetails: updatedDetails };
                    })
                  }
                  style={{ marginBottom: 8 }}
                />
                <Typography.Text strong>Context:</Typography.Text>
                <Input
                  value={detail.context}
                  placeholder="Enter context"
                  onChange={(e) =>
                    setCreateQuestion((prev) => {
                      const updatedDetails = [...prev.questionContextDetails];
                      updatedDetails[index] = {
                        ...updatedDetails[index],
                        context: e.target.value,
                      };
                      return { ...prev, questionContextDetails: updatedDetails };
                    })
                  }
                />
              </div>
            )}
            locale={{ emptyText: '' }}
          />
        )}
        <Button
          onClick={() =>
            setCreateQuestion((prev) => ({
              ...prev,
              questionContextDetails: [
                ...prev.questionContextDetails,
                { context: '', language: '' },
              ],
            }))
          }
          style={{ marginTop: 8 }}
        >
          Add Context Detail
        </Button>
      </Form.Item>

      {/* Nút lưu */}
      <Button type="primary" onClick={handleSave}>
        Save
      </Button>
    </Form>
  );
};

export default CreateQuestionComponent;
