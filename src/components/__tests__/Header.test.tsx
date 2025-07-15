import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { Header } from '../Header';
import { LiveEventsProvider } from '@/providers/LiveEventsProvider';

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
