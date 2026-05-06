import { useAppSelector } from '@/store';

// Light mode: warm buff/brown palette
const LIGHT_STAGE_COLORS = {
  Sales:     '#D69F6D',
  Designing: '#C07230',
  Execution: '#7A4218',
  Snags:     '#B87C4A',
  Handover:  '#E8C49A',
  Completed: '#4F312A',
};

// Dark mode: cool blue palette
const DARK_STAGE_COLORS = {
  Sales:     '#5AB5E8',
  Designing: '#3A8FC4',
  Execution: '#7ED3F0',
  Snags:     '#2A7DB5',
  Handover:  '#A8D8F0',
  Completed: '#1A6499',
};

// Light mode: priority shades
const LIGHT_PRIORITY_COLORS = {
  Low:    '#D69F6D',
  Medium: '#C07230',
  High:   '#7A4218',
  Urgent: '#4F312A',
};

// Dark mode: priority shades
const DARK_PRIORITY_COLORS = {
  Low:    '#A8D8F0',
  Medium: '#5AB5E8',
  High:   '#3A8FC4',
  Urgent: '#1A6499',
};

const StatusTag = ({ value, type = 'stage', colors: customColors }) => {
  const isDark = useAppSelector(s => s.ui.theme === 'dark');

  let defaultColors;
  if (type === 'priority') {
    defaultColors = isDark ? DARK_PRIORITY_COLORS : LIGHT_PRIORITY_COLORS;
  } else {
    defaultColors = isDark ? DARK_STAGE_COLORS : LIGHT_STAGE_COLORS;
  }

  const colors = customColors || defaultColors;
  const color = colors[value] || (isDark ? '#5AB5E8' : '#B87C4A');

  return (
    <span
      style={{
        display: 'inline-block',
        background: isDark ? `${color}28` : `${color}18`,
        color: color,
        border: `1px solid ${color}${isDark ? '60' : '45'}`,
        borderRadius: 6,
        fontWeight: 600,
        fontSize: 14,
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

// Export palettes so other files can import them
export {
  LIGHT_STAGE_COLORS, DARK_STAGE_COLORS,
  LIGHT_PRIORITY_COLORS, DARK_PRIORITY_COLORS,
};
