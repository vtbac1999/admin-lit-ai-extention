import React from 'react';
import { Modal, Typography, Descriptions, Switch } from 'antd';

const { Title } = Typography;

interface PricingPlanDetail {
  _id: string;
  name: { language: string; text: string }[];
  description: { language: string; text: string }[];
  type: string;
  numberOfCredits: number;
  price: number;
  sequence: number;
  isActive: boolean;
}

interface PricingPlanPopupProps {
  visible: boolean;
  onClose: () => void;
  plan: PricingPlanDetail;
}

const PricingPlanPopup: React.FC<PricingPlanPopupProps> = ({ visible, onClose, plan }) => {
  return (
    <Modal
      title={<Title level={4}>Pricing Plan Details</Title>}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Descriptions bordered column={1}>
        {/* Name */}
        <Descriptions.Item label="Name">
          {plan.name.map((item) => (
            <div key={item.language}>
              <strong>{item.language.toUpperCase()}:</strong> {item.text}
            </div>
          ))}
        </Descriptions.Item>

        {/* Description */}
        <Descriptions.Item label="Description">
          {plan.description.map((item) => (
            <div key={item.language}>
              <strong>{item.language.toUpperCase()}:</strong> {item.text}
            </div>
          ))}
        </Descriptions.Item>

        {/* Type */}
        <Descriptions.Item label="Type">{plan.type}</Descriptions.Item>

        {/* Number of Credits */}
        <Descriptions.Item label="Number of Credits">{plan.numberOfCredits}</Descriptions.Item>

        {/* Price */}
        <Descriptions.Item label="Price">{`${plan.price.toLocaleString()} VND`}</Descriptions.Item>

        {/* Sequence */}
        <Descriptions.Item label="Sequence">{plan.sequence}</Descriptions.Item>

        {/* Is Active */}
        <Descriptions.Item label="Active">
          <Switch checked={plan.isActive} disabled />
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default PricingPlanPopup;
