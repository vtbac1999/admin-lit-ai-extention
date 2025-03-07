import {
  MailOutlined,
  PhoneOutlined,
  SettingOutlined,
  HeartOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Pagination,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  notification,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserComponent from 'theme/components/edit/edit';
import axios from '../../util/axios';
const { Title, Text } = Typography;
// Dữ liệu mẫu
interface Member {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  gender: string;
}

const MemberManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalUserVisible, setIsModalUserVisible] = useState(false);
  const [isModalNewMember, setIsModalNewMember] = useState(false);
  const [editingUser, setEditingUser] = useState<UserApi>({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    avatar: '',
    gender: '',
  });
  const [detailUser, setDetailUser] = useState<UserApi>({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    avatar: '',
    gender: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState('');
  const [count, setCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [newMember, setNewMember] = useState<Member>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    gender: '',
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [error, setError] = useState<string | null>(null);
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    const pageParam = params.get('page');
    const limitParam = params.get('limit');
    return {
      page: pageParam ? parseInt(pageParam) : 1, // Mặc định là trang 1 nếu không có tham số
      limit: limitParam ? parseInt(limitParam) : 5, // Mặc định limit là 5 nếu không có tham số
    };
  };

  const { page: queryPage } = getQueryParams();
  const userRole = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') || 'manager')
    : '';
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
    const fetchUsers = async () => {
      setPage(queryPage); // Cập nhật giá trị page từ URL
      try {
        setIsLoading(true);
        const response = await axios.get('/manager', {
          params: {
            page,
            limit: limit,
            keyword: search,
          },
        }); // Replace with your API endpoint
        const users = response.data.result.items.map((item: UserApi) => {
          return {
            ...item,
            name: item.firstName + ' ' + item.lastName,
            status: item.isActive ? 'active' : 'inactive',
            key: item._id,
          };
        });
        setUsers(users);
        console.log(users);
        setCount(response.data.result.totalItems);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load users');
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [page, limit, search, location]);
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1); // Reset về trang đầu khi tìm kiếm
  };
  // Hàm mở Modal để chỉnh sửa
  const showEditModal = (user: UserApi) => {
    setEditingUser(user);
    setIsModalVisible(true);
  };
  const showModal = async (_id: string) => {
    try {
      const user = await axios.get(`/manager/${_id}`);
      setDetailUser(user.data.result);
      setIsModalUserVisible(true);
    } catch (error) {
      console.log(`🚀 ~ error:`, error);
    }
  };

  // Hàm đóng Modal
  const handleCancel = () => {
    setIsModalVisible(false);
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

  // Hàm lưu thay đổi sau khi chỉnh sửa
  const handleOk = async () => {
    try {
      console.log(editingUser);
      await axios.put(`/manager/${editingUser._id}`, editingUser);
    } catch (error) {
      console.log(`🚀 ~ error:`, error);
    }

    if (editingUser) {
      const user: User = {
        _id: editingUser._id,
        phone: editingUser.phone,
        email: editingUser.email,
        name: editingUser.firstName + ' ' + editingUser.lastName,
        role: editingUser.role,
        gender: editingUser.gender,
        status: editingUser.isActive ? 'active' : 'inactive',
      };
      const updatedUsers = users.map((item) => (item._id === user._id ? { ...user } : item));
      setUsers(updatedUsers);
      notification.success({
        message: 'Thông báo',
        description: 'Cập nhật người dùng thành công',
      });
    }
    setIsModalVisible(false);
  };

  // Hàm xóa người dùng
  const handleDelete = (userId: string) => {
    const updatedUsers = users.filter((user) => user._id !== userId);
    setUsers(updatedUsers);
    notification.success({
      message: 'Thông báo',
      description: 'Xóa người dùng thành công',
    });
  };

  // Cấu hình cột cho bảng dữ liệu
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: UserApi) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => showModal(record._id)}>
            Show
          </Button>
          {userRole.role === 'admin' && (
            <>
              <Button icon={<EditOutlined />} onClick={() => showEditModal(record)}>
                Edit
              </Button>
              <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record._id)}>
                Delete
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  // Hàm thay đổi trang
  const handlePageChange = (page: number) => {
    setPage(page);
    navigate({
      pathname: '/member', // Đường dẫn bạn muốn cập nhật
      search: `?page=${page}&keyword=${search}`, // Các tham số truy vấn
    });
  };
  const createMember = () => {
    setIsModalNewMember(true);
  };
  const handleCreateMember = async () => {
    // Xử lý logic tạo thành viên mới ở đây
    try {
      await axios.post('/manager', newMember);
      setUsers((prevUsers) => [
        ...prevUsers,
        {
          name: newMember.firstName + ' ' + newMember.lastName,
          email: newMember.email,
          role: newMember.role,
          status: 'active',
          _id: '',
          gender: newMember.gender,
        },
      ]);
      setIsModalNewMember(false);
      notification.success({
        message: 'Thông báo',
        description: 'Thêm quản lý thành công',
      });
    } catch (error) {
      console.log(`🚀 ~ error:`, error.response.data);
      setError(error.response.data.message);
    }
  };
  const handleCancelFormMember = () => {
    setIsModalNewMember(false);
  };
  const onClose = () => {
    setIsModalUserVisible(false);
  };
  return (
    <div className="user-management">
      <h1>Quản lý members</h1>
      {userRole.role === 'admin' && (
        <Button icon={<DownloadOutlined />} onClick={createMember}>
          + Create Member
        </Button>
      )}
      <Input onChange={(e) => handleSearch(e.target.value)} placeholder="Search" />
      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        pagination={false}
        loading={isLoading}
      />
      <Pagination
        current={page}
        pageSize={limit}
        total={count}
        onChange={(newPage) => handlePageChange(newPage)}
        style={{ marginTop: 16 }}
      />

      {/* Modal chỉnh sửa */}
      <Modal title="Chỉnh sửa người dùng" open={isModalVisible} onCancel={handleCancel}>
        <UserComponent user={editingUser} updateUser={handleOk} />
      </Modal>
      <Modal
        title="Create Member"
        open={isModalNewMember}
        onOk={handleCreateMember}
        onCancel={handleCancelFormMember}
      >
        <Form
          layout="vertical"
          initialValues={editingUser || { name: '', email: '', status: '', registrationTime: '' }}
          onFinish={handleOk}
        >
          <Form.Item label="First Name" name="first-name">
            <Input
              value={newMember?.firstName || ''}
              onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Last Name" name="last-name">
            <Input
              value={newMember?.lastName || ''}
              onChange={(e) => setNewMember({ ...newMember, lastName: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input
              value={newMember?.email || ''}
              onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
            />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select
              value={newMember?.role || ''}
              onChange={(value) => setNewMember({ ...newMember, role: value })}
            >
              <Select.Option value="manager">Manager</Select.Option>
              <Select.Option value="manager_prompt">Manager Prompt</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: 'Please select a gender' }]}
          >
            <Select
              value={newMember?.gender || ''}
              onChange={(value) => setNewMember({ ...newMember, gender: value })}
            >
              <Select.Option value="male">Male</Select.Option>
              <Select.Option value="female">Female</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input
              value={newMember?.phone || ''}
              onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
            />
          </Form.Item>
          {error && <Typography color="error">{error}</Typography>}
        </Form>
      </Modal>
      <Modal
        title="Detail User"
        open={isModalUserVisible}
        onCancel={onClose}
        footer={[
          <Button key="close" onClick={onClose}>
            Cancel
          </Button>,
        ]}
      >
        <Card
          style={{
            maxWidth: 400,
            margin: '0 auto',
            borderRadius: 10,
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          }}
          cover={
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <Avatar size={120} src={detailUser.avatar} style={{ border: '3px solid #1890ff' }} />
            </div>
          }
        >
          {/* User Info */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <Title level={3}>
              {detailUser.firstName} {detailUser.lastName}
            </Title>
            <Text type="secondary"> LIT Manager</Text>
          </div>
          {/* Contact Info */}
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text>
              <MailOutlined style={{ color: '#1890ff', marginRight: 8 }} />
              {detailUser.email}
            </Text>
            <Text>
              <PhoneOutlined style={{ color: '#52c41a', marginRight: 8 }} />
              {detailUser.phone}
            </Text>
            <Text>
              <SettingOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
              {detailUser.role}
            </Text>
            <Text>
              <HeartOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
              {detailUser.gender}
            </Text>
          </Space>

          {/* Social Media */}
        </Card>
      </Modal>
    </div>
  );
};

export default MemberManagement;

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  phone?: string;
  gender: string; // Có thể không có
}

interface UserApi {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive?: boolean;
  phone: string;
  registrationTime?: string; // Có thể không có
  avatar: string;
  gender: string;
}
