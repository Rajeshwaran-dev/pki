import { useAppSelector } from '@/store';

const stageColors = {
  Sales: '#1677FF',
  Designing: '#0ea5e9',
  Execution: '#722ED1',
  Snags: '#FF4D4F',
  Handover: '#FAAD14',
  Completed: '#52C41A',
};

const priorityColors = {
  Low: '#52C41A',
  Medium: '#1677FF',
  High: '#FAAD14',
  Urgent: '#FF4D4F',
};

const StatusTag = ({ value, type = 'stage', colors: customColors }) => {
  const isDark = useAppSelector(s => s.ui.theme === 'dark');
  const defaultColors = type === 'priority' ? priorityColors : stageColors;
  const colors = customColors || defaultColors;
  const color = colors[value] || '#888';

  return (
    <span
      style={{
        display: 'inline-block',
        background: isDark ? `${color}28` : `${color}18`,
        color: color,
        border: `1px solid ${color}${isDark ? '60' : '45'}`,
        borderRadius: 6,
        fontWeight: 600,
        fontSize: 11,
        padding: '2px 8px',
        lineHeight: 1.5,
        whiteSpace: 'nowrap',
      }}
    >
      {value}
    </span>
  );
};

export default StatusTag;
