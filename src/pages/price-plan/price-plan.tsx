import { DeleteOutlined, EditOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Table, Tag, message } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from '../../util/axios';
import { useNavigate } from 'react-router-dom';
import PricingPlanPopup from 'theme/components/edit/detail-description';
const { Option } = Select;

interface Subscription {
  _id: string;
  name_en: string;
  name_vi: string;
  price: number;
  duration: string;
  status: 'active' | 'inactive';
  description: { language: string; text: string }[];
}

interface SubscriptionAPI {
  _id: string;
  name: { language: string; text: string }[];
  description: { language: string; text: string }[];
  type: string;
  numberOfCredits: number;
  price: number;
  sequence: number;
  isActive: boolean;
}

interface SubscriptionNotId {
  name_en: string;
  name_vi: string;
  price: number;
  duration: string;
  status: 'active' | 'inactive';
  description: { language: string; text: string }[];
}

const PricePlan: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pricingPlan, setPricingPlan] = useState<SubscriptionAPI>({
    _id: '',
    name: [{ language: '', text: '' }],
    description: [{ language: '', text: '' }],
    type: '',
    numberOfCredits: 0,
    price: 0,
    sequence: 0,
    isActive: false,
  });
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch subscription data from server
    // Mock data for now
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
    const fetchData = async () => {
      const data = await axios.get('/pricing-plans');
      const mockData: Subscription[] = data.data.result.items.map((item: SubscriptionAPI) => {
        return {
          ...item,
          id: item._id,
          name_en: item.name[0].text,
          name_vi: item.name[1].text,
          price: formatCurrencyWithLocale(item.price),
          status: item.isActive ? 'active' : 'inactive',
          number_of_credits: item.numberOfCredits,
          description_en: item.description[0].text,
          description_vi: item.description[1].text,
        };
      });
      setSubscriptions(mockData);
      console.log(`🚀 ~ mockData:`, mockData);
    };
    fetchData();
  }, []);
  const formatCurrencyWithLocale = (price: number, locale: string = 'vi-VN') => {
    return new Intl.NumberFormat(locale).format(price);
  };

  const handleAddEditSubscription = (values: SubscriptionNotId) => {
    if (editingSubscription) {
      // Update existing subscription
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub._id === editingSubscription._id ? { ...editingSubscription, ...values } : sub,
        ),
      );
      message.success('Subscription updated successfully!');
    } else {
      // Add new subscription
      const newSubscription: Subscription = {
        _id: '',
        ...values,
      };
      setSubscriptions((prev) => [...prev, newSubscription]);
      message.success('Subscription added successfully!');
    }
    setIsModalOpen(false);
    setEditingSubscription(null);
    form.resetFields();
  };

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((sub) => sub._id !== id));
    message.success('Subscription deleted successfully!');
  };

  const openEditModal = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    form.setFieldsValue(subscription);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingSubscription(null);
    form.resetFields();
    setIsModalOpen(true);
  };
  const openShowModal = async (pricingPlan: Subscription) => {
    setIsModalVisible(true);
    const pricingPlanApi = await axios.get(`pricing-plans/${pricingPlan._id}`);
    setPricingPlan(pricingPlanApi.data.result);
  };

  const columns = [
    { title: 'Name English', dataIndex: 'name_en', key: 'name_en' },
    { title: 'Name VietNam', dataIndex: 'name_vi', key: 'name_vi' },
    { title: 'Price (VND)', dataIndex: 'price', key: 'price' },
    { title: 'Number Of Credits', dataIndex: 'number_of_credits', key: 'number_of_credits' },
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
      title: 'Actions',
      key: 'actions',
      render: (_id: string, record: Subscription) => (
        <>
          <Button
            icon={<EyeOutlined />}
            onClick={() => openShowModal(record)}
            style={{ marginRight: 8 }}
          >
            Show
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button icon={<DeleteOutlined />} onClick={() => handleDeleteSubscription(_id)} danger>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>Pricing Plan Management</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={openAddModal}
        style={{ marginBottom: 16 }}
      >
        Add Pricing Plan
      </Button>
      <Table dataSource={subscriptions} columns={columns} rowKey="id" />

      <Modal
        title={editingSubscription ? 'Edit Pricing Plan' : 'Add Pricing Plan'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleAddEditSubscription} layout="vertical">
          <Form.Item
            name="name_en"
            label="Name English"
            rules={[{ required: true, message: 'Please enter subscription name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name_vi"
            label="Name VietNam"
            rules={[{ required: true, message: 'Please enter subscription name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description_en"
            label="Description English"
            rules={[{ required: true, message: 'Please enter subscription name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description_vi"
            label="Description VietNam"
            rules={[{ required: true, message: 'Please enter subscription name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price ($)"
            rules={[{ required: true, message: 'Please enter subscription price' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="number_of_credits"
            label="Number Of Credits"
            rules={[{ required: true, message: 'Please select subscription duration' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <PricingPlanPopup
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        plan={pricingPlan}
      />
    </div>
  );
};

export default PricePlan;
