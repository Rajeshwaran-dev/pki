import { Button, Tooltip } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleTheme } from '@/store/slices/uiSlice';

const ThemeToggle = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(s => s.ui.theme);

  return (
    <Tooltip title={theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}>
      <Button
        type="text"
        shape="circle"
        icon={theme === 'light'
          ? <MoonOutlined style={{ fontSize: 17 }} />
          : <SunOutlined style={{ fontSize: 17, color: '#FAAD14' }} />
        }
        onClick={() => dispatch(toggleTheme())}
        style={{ transition: 'all 0.3s ease' }}
      />
    </Tooltip>
  );
};

export default ThemeToggle;
