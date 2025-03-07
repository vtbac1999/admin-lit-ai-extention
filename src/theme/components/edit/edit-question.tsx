import { Button, Form, Input } from 'antd';
import React, { useEffect } from 'react';

interface Question {
  _id: string;
  questionContextDetails: {
    context: string;
    language: string;
  }[];
  isActive: boolean;
}

interface QuestionComponentProps {
  question: Question;
  updateQuestion: (updatedQuestion: Question) => void;
}

const QuestionComponent: React.FC<QuestionComponentProps> = ({ question, updateQuestion }) => {
  const [form] = Form.useForm();

  // Đồng bộ giá trị ban đầu vào form
  useEffect(() => {
    if (question) {
      form.setFieldsValue({
        details: question.questionContextDetails.map((detail) => ({
          context: detail.context || '',
          language: detail.language || '',
        })),
      });
    }
  }, [question, form]);

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const updatedQuestion: Question = {
          ...question,
          questionContextDetails: values.details,
        };
        updateQuestion(updatedQuestion);
      })
      .catch((info) => {
        console.log('Validation Failed:', info);
      });
  };

  return (
    <Form form={form} layout="vertical">
      {/* Phần tử 0 */}
      <Form.Item
        label="Question Context VietNam"
        name={['details', 0, 'context']}
        rules={[{ required: true, message: 'Please enter the topic name!' }]}
      >
        <Input placeholder="Enter Vietnamese context" />
      </Form.Item>
      <Form.Item
        label="Language VietNam"
        name={['details', 0, 'language']}
        rules={[{ required: true, message: 'Please enter the language!' }]}
      >
        <Input placeholder="Enter Vietnamese language" />
      </Form.Item>

      {/* Phần tử 1 */}
      <Form.Item
        label="Question Context English"
        name={['details', 1, 'context']}
        rules={[{ required: true, message: 'Please enter the topic name!' }]}
      >
        <Input placeholder="Enter English context" />
      </Form.Item>

      <Form.Item
        label="Language English"
        name={['details', 1, 'language']}
        rules={[{ required: true, message: 'Please enter the language!' }]}
      >
        <Input placeholder="Enter English language" />
      </Form.Item>

      {/* Nút hành động */}
      <Form.Item>
        <Button type="primary" onClick={handleSave}>
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default QuestionComponent;
