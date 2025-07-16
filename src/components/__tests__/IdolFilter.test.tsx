import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IdolFilter } from '../IdolFilter';

// useLiveEventsフックをモック化
const mockIdols = [
  {
    id: 'idol1',
    short_name: 'Idol A',
    colors: { background: '#FF0000', foreground: '#FFFFFF', text: '#000000' },
  },
  {
    id: 'idol2',
    short_name: 'Idol B',
    colors: { background: '#00FF00', foreground: '#000000', text: '#000000' },
  },
  {
    id: 'idol3',
    short_name: 'Idol C',
    colors: { background: '#0000FF', foreground: '#FFFFFF', text: '#000000' },
  },
];

vi.mock('@/hooks/useLiveEvents', () => ({
  useLiveEvents: () => ({
    idols: mockIdols,
    allEvents: [],
    loading: false,
    error: null,
  }),
}));

// ToggleButtonをモック化
vi.mock('@/components/ui/ToggleButton', () => ({
  ToggleButton: vi.fn(({ label, isSelected, onToggle, onLongPress }) => (
    <button
      data-testid={`toggle-button-${label}`}
      data-is-selected={isSelected}
      onClick={() =>
        onToggle(label === 'Idol A' ? 'idol1' : label === 'Idol B' ? 'idol2' : 'idol3')
      }
      onContextMenu={(e) => {
        e.preventDefault();
        onLongPress(label === 'Idol A' ? 'idol1' : label === 'Idol B' ? 'idol2' : 'idol3');
      }}
    >
      {label}
    </button>
  )),
}));

describe('IdolFilter', () => {
  const mockOnSelectedIdolsChange = vi.fn();

  beforeEach(() => {
    mockOnSelectedIdolsChange.mockClear();
  });

  it('renders all idol buttons', () => {
    render(<IdolFilter selectedIdols={[]} onSelectedIdolsChange={mockOnSelectedIdolsChange} />);

    mockIdols.forEach((idol) => {
      expect(screen.getByText(idol.short_name)).toBeInTheDocument();
    });
  });

  it('calls onSelectedIdolsChange with updated selected idols when an unselected idol is clicked', () => {
    render(
      <IdolFilter selectedIdols={['idol1']} onSelectedIdolsChange={mockOnSelectedIdolsChange} />
    );

    // Idol Bのボタンをクリック（モックされたToggleButtonのonClickを直接呼び出す）
    screen.getByText('Idol B').click();
    expect(mockOnSelectedIdolsChange).toHaveBeenCalledWith(['idol1', 'idol2']);
  });

  it('calls onSelectedIdolsChange with updated selected idols when a selected idol is clicked', () => {
    render(
      <IdolFilter
        selectedIdols={['idol1', 'idol2']}
        onSelectedIdolsChange={mockOnSelectedIdolsChange}
      />
    );

    // Idol Bのボタンをクリック（モックされたToggleButtonのonClickを直接呼び出す）
    screen.getByText('Idol B').click();
    expect(mockOnSelectedIdolsChange).toHaveBeenCalledWith(['idol1']);
  });

  it('re-selects all idols when all are deselected', () => {
    render(
      <IdolFilter selectedIdols={['idol1']} onSelectedIdolsChange={mockOnSelectedIdolsChange} />
    );

    // Idol Aのボタンをクリック（モックされたToggleButtonのonClickを直接呼び出す）
    screen.getByText('Idol A').click();
    expect(mockOnSelectedIdolsChange).toHaveBeenCalledWith(mockIdols.map((idol) => idol.id));
  });

  it('calls onSelectedIdolsChange with only the long-pressed idol', () => {
    render(
      <IdolFilter
        selectedIdols={['idol1', 'idol2']}
        onSelectedIdolsChange={mockOnSelectedIdolsChange}
      />
    );

    // Idol Cのボタンを長押し（モックされたToggleButtonのonContextMenuを直接呼び出す）
    screen.getByText('Idol C').dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
    expect(mockOnSelectedIdolsChange).toHaveBeenCalledWith(['idol3']);
  });
});
