import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, message } from 'antd';
import axios from '../../util/axios'; // Tùy chỉnh URL axios nếu cần
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

interface Subscription {
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
  userId: string;
  pricingPlanId: string;
  fee: number;
  numberOfCredits: number;
  remainingCredits: number;
  startDateAt: string;
  endDateAt: string;
  isActive: boolean;
  autoRenew: boolean;
}

const SubscriptionPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/subscriptions'); // Thay bằng API endpoint của bạn
        setSubscriptions(response.data.result.items); // Cập nhật subscriptions từ API
      } catch (error) {
        message.error('Failed to fetch subscriptions!');
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  const handleAddSubscription = () => {
    // Logic để thêm subscription (hiển thị form modal hoặc điều hướng tới trang thêm mới)
    message.info('Add subscription logic here');
  };

  const handleDeactivateSubscription = (id: string) => {
    // Logic để cập nhật trạng thái subscription
    const updatedSubscriptions = subscriptions.map((sub) =>
      sub.userId === id ? { ...sub, isActive: false } : sub,
    );
    setSubscriptions(updatedSubscriptions);
    message.success('Subscription deactivated successfully!');
  };

  const columns = [
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Pricing Plan ID',
      dataIndex: 'pricingPlanId',
      key: 'pricingPlanId',
    },
    {
      title: 'Fee',
      dataIndex: 'fee',
      key: 'fee',
      render: (fee: number) => `${fee} VND`,
    },
    {
      title: 'Number of Credits',
      dataIndex: 'numberOfCredits',
      key: 'numberOfCredits',
    },
    {
      title: 'Remaining Credits',
      dataIndex: 'remainingCredits',
      key: 'remainingCredits',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDateAt',
      key: 'startDateAt',
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'End Date',
      dataIndex: 'endDateAt',
      key: 'endDateAt',
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Active' : 'Inactive'}</Tag>
      ),
    },
    {
      title: 'Auto Renew',
      dataIndex: 'autoRenew',
      key: 'autoRenew',
      render: (autoRenew: boolean) => (
        <Tag color={autoRenew ? 'blue' : 'gray'}>{autoRenew ? 'Yes' : 'No'}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_id: string, record: Subscription) => (
        <Button
          danger
          disabled={!record.isActive}
          onClick={() => handleDeactivateSubscription(record.userId)}
        >
          Deactivate
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h1>Subscription Management</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddSubscription}
        style={{ marginBottom: 16 }}
      >
        Add Subscription
      </Button>
      <Table dataSource={subscriptions} columns={columns} rowKey="userId" loading={loading} />
    </div>
  );
};

export default SubscriptionPage;
