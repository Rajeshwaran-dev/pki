import React from 'react';
import { Button, Tooltip } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleTheme } from '@/store/slices/uiSlice';

const ThemeToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(s => s.ui.theme);

  return (
    <Tooltip title={theme === 'light' ? 'Dark mode' : 'Light mode'}>
      <Button
        type="text"
        icon={theme === 'light' ? <MoonOutlined /> : <SunOutlined />}
        onClick={() => dispatch(toggleTheme())}
        style={{ fontSize: 18 }}
      />
    </Tooltip>
  );
};

export default ThemeToggle;
