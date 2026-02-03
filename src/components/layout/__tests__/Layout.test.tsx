import { render, screen } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { Layout } from '../Layout';

// HeaderとScrollToTopをモック化
vi.mock('@/components/layout/Header', () => ({
  Header: () => <div data-testid="mock-header">Mock Header</div>,
}));

vi.mock('@/components/layout/ScrollToTop', () => ({
  ScrollToTop: () => <div data-testid="mock-scroll-to-top">Mock ScrollToTop</div>,
}));

describe('Layout', () => {
  it('renders Header, ScrollToTop, Outlet content, and footer', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<div data-testid="outlet-content">Outlet Content</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    );

    // Mocked components
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-scroll-to-top')).toBeInTheDocument();

    // Outlet content
    expect(screen.getByTestId('outlet-content')).toBeInTheDocument();

    // Footer content
    expect(screen.getByText('Created by')).toBeInTheDocument();
    expect(screen.getByText('@momolab')).toBeInTheDocument();
  });
});
