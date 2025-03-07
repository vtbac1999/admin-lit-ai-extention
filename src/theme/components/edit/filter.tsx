import { Button, Select, Space, DatePicker } from 'antd';
import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface FilterProps {
  onFilterChange: (filter: {
    status: boolean | undefined;
    gender: string | undefined;
    fromDate: string | undefined;
    toDate: string | undefined;
  }) => void;
}

const FilterBar: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [status, setStatus] = useState<boolean | undefined>(undefined);
  const [gender, setGender] = useState<string | undefined>(undefined);
  const [fromDate, setFromDate] = useState<string | undefined>(undefined);
  const [toDate, setToDate] = useState<string | undefined>(undefined);

  const handleStatusChange = (value: boolean | undefined) => {
    setStatus(value);
  };

  const handleGenderChange = (value: string | undefined) => {
    setGender(value);
  };

  const handleDateChange = (dates: [Dayjs, Dayjs] | null, dateStrings: [string, string]) => {
    if (dates) {
      setFromDate(dateStrings[0] || undefined);
      setToDate(dateStrings[1] || undefined);
    } else {
      setFromDate(undefined);
      setToDate(undefined);
    }
  };

  const handleApplyFilters = () => {
    onFilterChange({ status, gender, fromDate, toDate });
  };

  const handleResetFilters = () => {
    setStatus(undefined);
    setGender(undefined);
    setFromDate(undefined);
    setToDate(undefined);
    onFilterChange({
      status: undefined,
      gender: undefined,
      fromDate: undefined,
      toDate: undefined,
    }); // Reset filters
  };

  return (
    <Space style={{ marginBottom: 16 }} size="middle" wrap>
      {/* Select Status */}
      <Select
        placeholder="Select Status"
        value={status}
        onChange={(value) => handleStatusChange(value as boolean | undefined)}
        style={{ width: 200 }}
        allowClear
      >
        <Option value={true}>Active</Option>
        <Option value={false}>InActive</Option>
      </Select>

      {/* Select Gender */}
      <Select
        placeholder="Select Gender"
        value={gender}
        onChange={(value) => handleGenderChange(value as string | undefined)}
        style={{ width: 200 }}
        allowClear
      >
        <Option value="male">Male</Option>
        <Option value="female">Female</Option>
      </Select>

      {/* Date Range Picker */}
      <RangePicker
        style={{ width: 400 }}
        format="YYYY-MM-DD"
        onChange={handleDateChange}
        value={
          fromDate && toDate
            ? [dayjs(fromDate, 'YYYY-MM-DD'), dayjs(toDate, 'YYYY-MM-DD')]
            : undefined
        }
        allowClear
      />

      {/* Action Buttons */}
      <Button type="primary" onClick={handleApplyFilters}>
        Apply Filters
      </Button>
      <Button onClick={handleResetFilters}>Reset</Button>
    </Space>
  );
};

export default FilterBar;
