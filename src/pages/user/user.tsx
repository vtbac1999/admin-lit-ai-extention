import { DeleteOutlined, DownloadOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import Typography from '@mui/material/Typography';
import {
  Button,
  Descriptions,
  Form,
  Input,
  Modal,
  Pagination,
  Radio,
  Select,
  Space,
  Table,
  TablePaginationConfig,
  Tag,
  notification,
} from 'antd';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EditUser from 'theme/components/edit/edit-user';
import FilterBar from 'theme/components/edit/filter';
import axios from '../../util/axios';
import './user.css';
// Dữ liệu mẫu
interface Member {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalUserVisible, setIsModalUserVisible] = useState(false);
  const [isModalNewMember, setIsModalNewMember] = useState(false);
  const [isModalExcelVisible, setIsModalExcelVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserApi>({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
  });
  const [detailUser, setDetailUser] = useState<UserApi>({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState('');
  const [count, setCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [newMember, setNewMember] = useState<Member>({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [loadPage, setLoadPage] = useState<boolean>(false);
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    const pageParam = params.get('page');
    const limitParam = params.get('limit');
    return {
      page: pageParam ? parseInt(pageParam) : 1, // Mặc định là trang 1 nếu không có tham số
      limit: limitParam ? parseInt(limitParam) : 5, // Mặc định limit là 5 nếu không có tham số
    };
  };
  const options = [
    { label: 'Tất cả người dùng', value: 'all' },
    { label: 'Trang hiện tại', value: 'page' },
    { label: 'Kết quả tìm kiếm', value: 'filter' },
  ];
  const { page: queryPage } = getQueryParams();
  const userRole = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') || 'manager')
    : '';
  const fetchUsers = async (sort?: string, order?: 'ASC' | 'DESC' | null) => {
    setPage(queryPage); // Cập nhật giá trị page từ URL
    try {
      setIsLoading(true);
      const orderBy = sort ? sort : '';
      const field = order ? order : '';
      const response = await axios.get('/users', {
        params: {
          page,
          limit: limit,
          keyword: search,
          orderBy,
          orderDirection: field,
        },
      }); // Re
      const users = response.data.result.items.map((item: UserApi) => {
        return {
          ...item,
          name: item.firstName + ' ' + item.lastName,
          status: item.isActive ? 'active' : 'inactive',
          subscription: item?.subscription?.planNames[1].text,
          remaining_request: item?.subscription?.remainingCredits,
          used_request:
            (item?.subscription?.numberOfCredits ?? 0) -
            (item?.subscription?.remainingCredits ?? 0),
        };
      });
      setUsers(users);
      setCount(response.data.result.totalItems);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load users');
      setIsLoading(false);
    }
  };
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
    fetchUsers();
  }, [page, limit, search, location, loadPage]);
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1); // Reset về trang đầu khi tìm kiếm
  };
  const handleSort = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<User>,
  ) => {
    let field = sorter.field ? String(sorter.field) : '';
    field = field == 'name' ? 'lastName' : field;
    const order = sorter.order === 'ascend' ? 'ASC' : sorter.order === 'descend' ? 'DESC' : null;
    setPage(1); // Reset trang về 1 khi thay đổi sắp xếp
    setLoadPage(true);
    fetchUsers(field, order); // Gọi API với các tham số cần thiết
  };
  // Hàm mở Modal để chỉnh sửa
  const showEditModal = (user: UserApi) => {
    setEditingUser(user);
    setIsModalVisible(true);
  };
  const showModal = async (_id: string) => {
    try {
      const user = await axios.get(`/users/${_id}`);
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
    });
  };

  // Hàm lưu thay đổi sau khi chỉnh sửa
  const handleOk = async (updateUser: UserApi) => {
    try {
      await axios.put(`/users/${editingUser._id}`, updateUser);
    } catch (error) {
      console.log(`🚀 ~ error:`, error);
    }

    if (updateUser) {
      const user = {
        ...editingUser,
        _id: editingUser._id,
        phone: updateUser.phone,
        email: updateUser.email,
        name: updateUser.firstName + ' ' + updateUser.lastName,
        role: updateUser.role,
        status: editingUser.isActive ? 'active' : 'inactive',
      };
      const updatedUsers = users.map((item) =>
        item._id === user._id
          ? {
              ...user,
              status:
                user.status === 'active' || user.status === 'inactive' ? user.status : 'inactive',
            }
          : {
              ...item,
              status:
                item.status === 'active' || item.status === 'inactive' ? item.status : 'inactive',
            },
      );
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
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
    },
    { title: 'Subscription', dataIndex: 'subscription', key: 'subscription' },
    { title: 'Remaining Request', dataIndex: 'remaining_request', key: 'remaining_request' },
    { title: 'Used Request', dataIndex: 'used_request', key: 'used_request' },
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
          <Button icon={<EyeOutlined />} onClick={() => showModal(record._id)}></Button>
          {userRole.role === 'admin' && (
            <>
              <Button icon={<EditOutlined />} onClick={() => showEditModal(record)}></Button>
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleDelete(record._id)}
              ></Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  // Hàm thay đổi trang
  const handlePageChange = (page: number, sortField?: string, sortOrder?: string) => {
    setPage(page);

    // Xây dựng query string với cả keyword, page, sortField và sortOrder
    const queryParams = new URLSearchParams({
      page: page.toString(),
      keyword: search || '',
      ...(sortField && { sortField }), // Chỉ thêm nếu sortField tồn tại
      ...(sortOrder && { sortOrder }), // Chỉ thêm nếu sortOrder tồn tại
    });

    // Cập nhật URL bằng navigate
    navigate({
      pathname: '/users',
      search: `?${queryParams.toString()}`,
    });

    // Fetch dữ liệu mới từ API
  };
  const handleCreateMember = async () => {
    // Xử lý logic tạo thành viên mới ở đây
    try {
      await axios.post('/users', newMember);
      setUsers((prevUsers) => [
        ...prevUsers,
        {
          name: newMember.firstName + ' ' + newMember.lastName,
          email: newMember.email,
          role: newMember.role,
          status: 'active',
          _id: newMember._id,
        },
      ]);
      setIsModalNewMember(false);
      notification.success({
        message: 'Thông báo',
        description: 'Thêm quản lý thành công',
      });
    } catch (error) {
      console.log(`🚀 ~ error:`, error.response.data);
      setError(error.response.data.message[0].message);
    }
  };
  const handleCancelFormMember = () => {
    setIsModalNewMember(false);
  };
  const onClose = () => {
    setIsModalUserVisible(false);
  };
  const handleFilterChange = async (filter: {
    status: boolean;
    gender: string;
    fromDate: string | undefined;
    toDate: string | undefined;
  }) => {
    const gender = filter.gender ? `&genders[]=${filter.gender}` : '';
    const query = filter.status ?? ``;
    const fromDate = filter.fromDate ? `&startDateRegisterPlan=${filter.fromDate}` : '';
    const toDate = filter.toDate ? `&endDateRegisterPlan=${filter.toDate}` : '';
    const data = await axios.get(`/users?isActive=${query}${gender}${fromDate}${toDate}`);
    const users = data.data.result.items.map((item: UserApi) => {
      return {
        ...item,
        name: item.firstName + ' ' + item.lastName,
        status: item.isActive ? 'active' : 'inactive',
        subscription: item?.subscription?.planNames[1].text,
        remaining_request: item?.subscription?.remainingCredits,
        used_request:
          (item?.subscription?.numberOfCredits ?? 0) - (item?.subscription?.remainingCredits ?? 0),
      };
    });
    setUsers(users);
    setCount(data.data.result.totalItems);
  };
  const handleExportExcel = async () => {
    try {
      const searchExcel = selectedValue === 'filter' ? search : '';
      // Gửi yêu cầu tới API để tải tệp
      const response = await axios.get(
        `/users/export?page=${page}&limit=${limit}&keyword=${searchExcel}&type=${selectedValue}`,
        {
          responseType: 'blob', // Đảm bảo nhận blob từ server
        },
      );

      // Tạo URL blob từ dữ liệu phản hồi
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Lấy tên tệp từ content-disposition hoặc đặt tên mặc định
      const contentDisposition = response.headers['content-disposition'];
      let fileName = 'download.xlsx'; // Tên mặc định

      if (contentDisposition) {
        const matches = contentDisposition.match(/filename="(.+?)"/);
        if (matches?.[1]) {
          fileName = decodeURIComponent(matches[1]); // Giải mã tên tệp nếu cần
        }
      }

      // Đặt tên tệp cho liên kết tải xuống
      link.setAttribute('download', fileName);

      // Tự động kích hoạt tải xuống
      document.body.appendChild(link); // Thêm link vào DOM
      link.click(); // Bắt đầu tải xuống
      document.body.removeChild(link); // Xóa liên kết sau khi tải

      // Đóng modal
      setIsModalExcelVisible(false);
    } catch (error) {
      console.log(`🚀 ~ error:`, error);
    }
  };
  const handleExcel = () => {
    setIsModalExcelVisible(true);
  };
  return (
    <div className="user-management">
      <h1>User Manager</h1>
      <Button
        onClick={() => handleExcel()}
        type="primary"
        icon={<DownloadOutlined />}
        size="large"
        style={{ marginBottom: 16 }}
      >
        Export to Excel
      </Button>
      <FilterBar onFilterChange={handleFilterChange} />
      <Input onChange={(e) => handleSearch(e.target.value)} placeholder="Search" />
      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        pagination={false}
        loading={isLoading}
        onChange={handleSort}
      />
      <Pagination
        current={page}
        pageSize={limit}
        total={count}
        onChange={(newPage) => handlePageChange(newPage)}
        style={{ marginTop: 16 }}
      />

      <Modal open={isModalVisible} onCancel={handleCancel} footer={null}>
        <EditUser user={editingUser} onSave={handleOk} />
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
          <Form.Item label="Phone" name="phone">
            <Input
              value={newMember?.phone || ''}
              onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
            />
          </Form.Item>

          {/* <Form.Item label="Ngày đăng ký" name="registrationTime">
            <Input
              value={newMember?.registrationTime || ''}
              onChange={(e) => setNewMember({ ...newMember, registrationTime: e.target.value })}
            />
          </Form.Item> */}
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
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
        {detailUser ? (
          <Descriptions
            title="Information"
            bordered
            column={2}
            size="middle"
            labelStyle={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}
            contentStyle={{ backgroundColor: '#fafafa' }}
          >
            <Descriptions.Item label="ID" span={2}>
              {detailUser._id}
            </Descriptions.Item>
            <Descriptions.Item label="First Name">{detailUser.firstName}</Descriptions.Item>
            <Descriptions.Item label="Last Name">{detailUser.lastName}</Descriptions.Item>
            <Descriptions.Item label="Email" span={2}>
              {detailUser.email}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {detailUser.isActive ? 'Active' : 'Inactive'}
            </Descriptions.Item>
            <Descriptions.Item label="Role">{detailUser.role}</Descriptions.Item>
          </Descriptions>
        ) : (
          <p>No data</p>
        )}
      </Modal>
      <Modal
        title="Export Data"
        open={isModalExcelVisible}
        onCancel={() => setIsModalExcelVisible(false)}
        onOk={handleExportExcel}
      >
        <Form layout="vertical" style={{ maxWidth: 400, margin: '50px auto' }}>
          <Form.Item label="Kết quả trích xuất:">
            <Radio.Group
              onChange={(e) => setSelectedValue(e.target.value)}
              value={selectedValue}
              style={{ display: 'flex', flexDirection: 'column' }} // Sử dụng flex để buộc xuống dòng
            >
              {options.map((option) => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        </Form>
        ,
      </Modal>
    </div>
  );
};

export default UserManagement;

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone?: string;
  registrationTime?: string; // Có thể không có
  subscription?: {
    remainingCredits: number;
    numberOfCredits: number;
    planNames: { language: string; text: string }[];
  };
}

interface UserApi {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  subscription?: {
    remainingCredits: number;
    numberOfCredits: number;
    planNames: {
      language: string;
      text: string;
    }[];
  };
  isActive?: boolean;
  phone?: string;
  registrationTime?: string; // Có thể không có
}
