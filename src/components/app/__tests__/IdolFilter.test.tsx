import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockIdols } from '@/__mocks__';
import { IdolFilter } from '../IdolFilter';

// useLiveEventsフックをモック化
vi.mock('@/providers/LiveEventsProvider', () => ({
  useLiveEvents: () => ({
    idols: mockIdols,
    allEvents: [],
    loading: false,
    error: null,
  }),
}));

// ToggleButtonをモック化
vi.mock('@/components/common/ToggleButton', () => ({
  ToggleButton: vi.fn(({ label, isSelected, onToggle, onLongPress }) => (
    <button
      data-testid={`toggle-button-${label}`}
      data-is-selected={isSelected}
      onClick={() => onToggle(mockIdols.find((idol) => idol.short_name === label)?.id ?? 'unknown')}
      onContextMenu={(e) => {
        e.preventDefault();
        onLongPress(mockIdols.find((idol) => idol.short_name === label)?.id ?? 'unknown');
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

    expect(screen.getByText(mockIdols[0].short_name)).toBeInTheDocument();
    expect(screen.getByText(mockIdols[1].short_name)).toBeInTheDocument();
    // Idol Cはlitlink_idがないため、フィルタ対象外
    expect(screen.getByText(mockIdols[3].short_name)).toBeInTheDocument();
    expect(screen.getByText(mockIdols[4].short_name)).toBeInTheDocument();
  });

  it('calls onSelectedIdolsChange with updated selected idols when an unselected idol is clicked', () => {
    render(
      <IdolFilter
        selectedIdols={[mockIdols[0].id]}
        onSelectedIdolsChange={mockOnSelectedIdolsChange}
      />
    );

    // Idol Bのボタンをクリック（モックされたToggleButtonのonClickを直接呼び出す）
    screen.getByText(mockIdols[1].short_name).click();
    expect(mockOnSelectedIdolsChange).toHaveBeenCalledWith([mockIdols[0].id, mockIdols[1].id]);
  });

  it('calls onSelectedIdolsChange with updated selected idols when a selected idol is clicked', () => {
    render(
      <IdolFilter
        selectedIdols={[mockIdols[0].id, mockIdols[1].id]}
        onSelectedIdolsChange={mockOnSelectedIdolsChange}
      />
    );

    // Idol Bのボタンをクリック（モックされたToggleButtonのonClickを直接呼び出す）
    screen.getByText(mockIdols[1].short_name).click();
    expect(mockOnSelectedIdolsChange).toHaveBeenCalledWith([mockIdols[0].id]);
  });

  it('re-selects all idols when all are deselected', () => {
    render(
      <IdolFilter
        selectedIdols={[mockIdols[0].id]}
        onSelectedIdolsChange={mockOnSelectedIdolsChange}
      />
    );

    // Idol Aのボタンをクリック（モックされたToggleButtonのonClickを直接呼び出す）
    screen.getByText(mockIdols[0].short_name).click();
    expect(mockOnSelectedIdolsChange).toHaveBeenCalledWith(mockIdols.map((idol) => idol.id));
  });

  it('calls onSelectedIdolsChange with only the long-pressed idol', () => {
    render(
      <IdolFilter
        selectedIdols={[mockIdols[0].id, mockIdols[1].id]}
        onSelectedIdolsChange={mockOnSelectedIdolsChange}
      />
    );

    // Idol Bのボタンを長押し（モックされたToggleButtonのonContextMenuを直接呼び出す）
    screen
      .getByText(mockIdols[1].short_name)
      .dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
    expect(mockOnSelectedIdolsChange).toHaveBeenCalledWith([mockIdols[1].id]);
  });
});
