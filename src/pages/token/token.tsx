import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Modal, Form, Select, Pagination, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Token {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  expirationDate: string;
  email: string;
  role: string;
  totalRequest: number;
  remainingRequest: number;
  usedRequest: number;
}

const tokenData: Token[] = [
  {
    id: '1',
    name: 'Token A',
    email: 'tokenA@example.com',
    status: 'active',
    expirationDate: '2024-12-31',
    role: 'admin',
    totalRequest: 100,
    remainingRequest: 50,
    usedRequest: 50,
  },
  {
    id: '2',
    name: 'Token B',
    email: 'tokenB@example.com',
    status: 'inactive',
    expirationDate: '2025-01-15',
    role: 'user',
    totalRequest: 200,
    remainingRequest: 100,
    usedRequest: 100,
  },
  // Thêm token mẫu nếu cần
];

const TokenManagement: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>(tokenData);
  const [filteredTokens, setFilteredTokens] = useState<Token[]>(tokenData);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingToken, setEditingToken] = useState<Token | null>(null);

  useEffect(() => {
    const filtered = tokens.filter((token) =>
      token.name.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredTokens(filtered);
  }, [search, tokens]);

  const handleAddToken = () => {
    setEditingToken(null);
    setIsModalVisible(true);
  };

  const handleEditToken = (record: Token) => {
    setEditingToken(record);
    setIsModalVisible(true);
  };

  const handleDeleteToken = (id: string) => {
    setTokens((prev) => prev.filter((token) => token.id !== id));
  };

  const handleModalSubmit = (values: Token) => {
    if (editingToken) {
      setTokens((prev) =>
        prev.map((token) => (token.id === editingToken.id ? { ...values, id: token.id } : token)),
      );
    } else {
      setTokens((prev) => [...prev, { ...values, id: Date.now().toString() }]);
    }
    setIsModalVisible(false);
  };

  const columns: ColumnsType<Token> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Subscription Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Expiration Date',
      dataIndex: 'expirationDate',
      key: 'expirationDate',
    },
    {
      title: 'Total Request',
      dataIndex: 'totalRequest',
      key: 'totalRequest',
    },
    {
      title: 'Remaining Request',
      dataIndex: 'remainingRequest',
      key: 'remainingRequest',
    },
    {
      title: 'Used Request',
      dataIndex: 'usedRequest',
      key: 'usedRequest',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEditToken(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDeleteToken(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16, justifyContent: 'space-between', display: 'flex' }}>
        <Input
          placeholder="Tìm kiếm token"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={handleAddToken}>
          Thêm Token
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredTokens.slice((page - 1) * pageSize, page * pageSize)}
        rowKey="id"
        pagination={false}
      />
      <Pagination
        current={page}
        pageSize={pageSize}
        total={filteredTokens.length}
        onChange={(p) => setPage(p)}
        style={{ marginTop: 16 }}
      />

      <Modal
        title={editingToken ? 'Sửa Token' : 'Thêm Token'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={
            editingToken || { name: '', status: 'active', expirationDate: '', role: '' }
          }
          onFinish={handleModalSubmit}
        >
          <Form.Item
            label="Tên Token"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên token' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Vui lòng nhập tên token' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Trạng thái" name="status">
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Ngày hết hạn"
            name="expirationDate"
            rules={[{ required: true, message: 'Vui lòng nhập ngày hết hạn' }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Quyền" name="totalRequest">
            <Select>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="user">User</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Quyền" name="remainingRequest">
            <Select>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="user">User</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Quyền" name="usedRequest">
            <Select>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="user">User</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space style={{ justifyContent: 'flex-end', width: '100%' }}>
              <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TokenManagement;
