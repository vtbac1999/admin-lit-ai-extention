import React, { useEffect } from 'react';
import { Form, Input, Select, Button } from 'antd';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
  isActive?: boolean;
  phone?: string;
}

interface EditUserProps {
  user: User | null;
  onSave: (updatedUser: User) => void;
}

const EditUser: React.FC<EditUserProps> = ({ user, onSave }) => {
  const [form] = Form.useForm();

  // Synchronize form values with the user data
  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
  }, [user, form]);

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        onSave(values); // Pass updated user data to the parent
      })
      .catch((errorInfo) => {
        console.error('Validation Failed:', errorInfo);
      });
  };

  return (
    <Form layout="vertical" form={form}>
      <Form.Item
        label="First Name"
        name="firstName"
        rules={[{ required: true, message: 'First Name is required' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Last Name"
        name="lastName"
        rules={[{ required: true, message: 'Last Name is required' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Email is required' },
          { type: 'email', message: 'Enter a valid email' },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Role is required' }]}>
        <Select>
          <Select.Option value="manager">Manager</Select.Option>
          <Select.Option value="manager_prompt">Manager Prompt</Select.Option>
        </Select>
      </Form.Item>
      <Button onClick={handleSave}>Save</Button>
    </Form>
  );
};

export default EditUser;
