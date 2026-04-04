import React from 'react';
import { Layout, Input, Badge, Avatar, Dropdown, Button, Space } from 'antd';
import {
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  MenuOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '@/store';
import { setMobileSidebarOpen } from '@/store/slices/uiSlice';
import ThemeToggle from '@/components/shared/ThemeToggle';
import useIsMobile from '@/hooks/useIsMobile';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(s => s.ui.theme);
  const collapsed = useAppSelector(s => s.ui.sidebarCollapsed);
  const isMobile = useIsMobile();

  const bg = theme === 'dark' ? '#1f1f1f' : '#ffffff';
  const marginLeft = isMobile ? 0 : collapsed ? 72 : 240;

  const profileItems = [
    { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true },
  ];

  return (
    <Header
      style={{
        background: bg,
        padding: '0 24px',
        height: 64,
        lineHeight: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#f0f0f0'}`,
        position: 'fixed',
        top: 0,
        right: 0,
        left: marginLeft,
        zIndex: 99,
        transition: 'left 0.3s cubic-bezier(0.2, 0, 0, 1)',
      }}
    >
      <Space>
        {isMobile && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => dispatch(setMobileSidebarOpen(true))}
          />
        )}
        <Input
          prefix={<SearchOutlined style={{ color: '#bbb' }} />}
          placeholder="Search projects, clients..."
          style={{ width: isMobile ? 160 : 300, borderRadius: 8 }}
          allowClear
        />
      </Space>

      <Space size="middle">
        <ThemeToggle />
        <Badge count={3} size="small">
          <Button type="text" icon={<BellOutlined style={{ fontSize: 18 }} />} />
        </Badge>
        <Dropdown menu={{ items: profileItems }} placement="bottomRight" trigger={['click']}>
          <Avatar
            style={{ background: '#C8A75D', cursor: 'pointer' }}
            icon={<UserOutlined />}
          />
        </Dropdown>
      </Space>
    </Header>
  );
};

export default AppHeader;
