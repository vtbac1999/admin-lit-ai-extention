import { Button, Form, Input, Select } from 'antd';
import React, { useState, useEffect } from 'react';

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

interface UserComponentProps {
  user: User;
  updateUser: (updatedUser: User) => void;
}

const UserComponent: React.FC<UserComponentProps> = ({ user, updateUser }) => {
  const [editingUser, setEditingUser] = useState<User>({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,
    gender: user.gender,
  });
  const [form] = Form.useForm();
  // Đồng bộ giá trị ban đầu vào form
  useEffect(() => {
    if (editingUser) {
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [editingUser, form]);
  const onFinish = () => {
    updateUser(editingUser);
    setEditingUser({
      _id: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
      avatar: '',
      gender: '',
    });
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item
        label="First Name"
        name="firstName"
        rules={[{ required: true, message: 'First Name is required' }]}
      >
        <Input
          value={editingUser.firstName}
          onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
        />
      </Form.Item>
      <Form.Item
        label="Last Name"
        name="lastName"
        rules={[{ required: true, message: 'Last Name is required' }]}
      >
        <Input
          value={editingUser.lastName}
          onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
        />
      </Form.Item>
      <Form.Item
        label="Gender"
        name="gender"
        rules={[{ required: true, message: 'Please select a role' }]}
      >
        <Select
          value={editingUser.gender}
          onChange={(value) => setEditingUser({ ...editingUser, gender: value })}
        >
          <Select.Option value="male">Male</Select.Option>
          <Select.Option value="female">Female</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="Phone"
        name="phone"
        rules={[
          { required: true, message: 'Phone number is required' },
          { pattern: /^\d{9,16}$/, message: 'Phone must be 9-16 digits' },
        ]}
      >
        <Input
          value={editingUser.phone}
          onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
        />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Save
      </Button>
    </Form>
  );
};

export default UserComponent;
