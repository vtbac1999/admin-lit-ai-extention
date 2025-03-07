import { EditOutlined, MailOutlined, PhoneOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Modal, Space, Typography, notification } from 'antd';
import React, { useState } from 'react';
import './profile.css';
import UserComponent from 'theme/components/edit/edit';
import axios from 'util/axios';
const { Title, Text } = Typography;
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  gender: string;
}
const ProfileCard: React.FC<{ user: User }> = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const updateUser = async (updatedUser: User) => {
    try {
      await axios.put(`manager/${user._id}`, updatedUser);
      notification.success({
        message: 'Thông báo',
        description: 'Cập nhật thông tin thành công',
      });
    } catch (error) {
      console.log(`🚀 ~ error:`, error);
    }
  };
  return (
    <Card
      style={{
        maxWidth: 400,
        margin: '0 auto',
        borderRadius: 10,
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      }}
      cover={
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Avatar size={120} src={user.avatar} style={{ border: '3px solid #1890ff' }} />
        </div>
      }
    >
      {/* User Info */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <Title level={3}>
          {user.firstName} {user.lastName}
        </Title>
        <Text type="secondary"> LIT Manager</Text>
      </div>
      <Modal title="User Profile" open={isModalOpen} onCancel={handleCloseModal} footer={null}>
        <UserComponent user={user} updateUser={updateUser} />
      </Modal>
      {/* Contact Info */}
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <Text>
          <MailOutlined style={{ color: '#1890ff', marginRight: 8 }} />
          {user.email}
        </Text>
        <Text>
          <PhoneOutlined style={{ color: '#52c41a', marginRight: 8 }} />
          {user.phone}
        </Text>
        <Text>
          <SettingOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
          {user.role}
        </Text>
      </Space>

      {/* Social Media */}
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <Space size="middle">
          <Button
            type="link"
            onClick={handleOpenModal}
            icon={<EditOutlined />}
            style={{ color: '#0077b5' }}
          />
        </Space>
      </div>
    </Card>
  );
};

export default ProfileCard;
