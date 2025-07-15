import { LiveEventsProvider } from '@/providers/LiveEventsProvider';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Header } from '../Header';

describe('Header', () => {
  it('renders header with title', () => {
    render(
      <BrowserRouter>
        <LiveEventsProvider>
          <Header />
        </LiveEventsProvider>
      </BrowserRouter>
    );
    expect(screen.getByText('開催予定のライブ')).toBeInTheDocument();
  });
});
