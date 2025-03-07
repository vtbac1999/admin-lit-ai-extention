import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'util/axios';

interface Topic {
  _id: string;
  topicContextDetails: {
    name: string;
    description: string;
    language: string;
  }[];
  image: string;
}
interface EditTopicFormProps {
  visible: boolean;
  onClose: () => void;
  topic: Topic | null;
  onSave: (updatedTopic: TopicNotId) => void;
}
interface TopicNotId {
  topicContextDetails: {
    name: string;
    description: string;
    language: string;
  }[];
  image: string;
}
const EditTopicForm: React.FC<EditTopicFormProps> = ({ visible, onClose, topic, onSave }) => {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    if (topic) {
      form.setFieldsValue({
        details: topic.topicContextDetails.map((detail) => ({
          name: detail.name || '',
          description: detail.description || '',
          language: detail.language || '',
        })),
        image: topic.image || '',
      });
      setImageUrl(topic.image || '');
    }
  }, [topic]);

  const handleFinish = async (values: {
    details: { description: string; language: string; name: string }[];
    image: string;
  }) => {
    try {
      const updatedTopic: TopicNotId = {
        ...topic,
        topicContextDetails: values.details,
        image: imageUrl,
      };
      // Cập nhật topic lên server
      const { data } = await axios.put(`/topics/${topic?._id}`, updatedTopic);
      // Gửi dữ liệu cập nhật đến parent component
      onSave(updatedTopic);
      message.success('Topic updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating topic:', error);
      message.error('Failed to update topic. Please try again.');
    }
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const { data } = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImageUrl(data.result.path);
      message.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal title="Edit Topic" open={visible} onCancel={onClose} footer={null} destroyOnClose>
      {topic && (
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          {/* Phần tử 0 */}
          <Form.Item
            label="Topic Name VietNam"
            name={['details', 0, 'name']}
            rules={[{ required: true, message: 'Please enter the topic name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description VietNam"
            name={['details', 0, 'description']}
            rules={[{ required: true, message: 'Please enter the description!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Language VietNam"
            name={['details', 0, 'language']}
            rules={[{ required: true, message: 'Please enter the language!' }]}
          >
            <Input />
          </Form.Item>

          {/* Phần tử 1 */}
          <Form.Item
            label="Topic Name English"
            name={['details', 1, 'name']}
            rules={[{ required: true, message: 'Please enter the topic name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description English"
            name={['details', 1, 'description']}
            rules={[{ required: true, message: 'Please enter the description!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Language English"
            name={['details', 1, 'language']}
            rules={[{ required: true, message: 'Please enter the language!' }]}
          >
            <Input />
          </Form.Item>

          {/* Hình ảnh */}
          <Form.Item label="Image">
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={(file) => {
                handleImageUpload(file);
                return false; // Ngăn tải lên tự động
              }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Topic"
                  style={{ width: '100%', maxHeight: '150px', objectFit: 'cover' }}
                />
              ) : (
                <div>
                  <UploadOutlined />
                  <div>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          {/* Nút hành động */}
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={uploading}>
              Save
            </Button>
            <Button onClick={onClose} style={{ marginLeft: '8px' }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default EditTopicForm;
