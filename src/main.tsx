import { Layout } from '@/components/Layout';
import { LiveEventsProvider } from '@/providers/LiveEventsProvider';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import { AboutPage } from './pages/About';
import { EventsPage } from './pages/EventsPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <LiveEventsProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<EventsPage mode="upcoming" />} />
            <Route path="past" element={<EventsPage mode="past" />} />
            <Route path="about" element={<AboutPage />} />
          </Route>
        </Routes>
      </LiveEventsProvider>
    </BrowserRouter>
  </StrictMode>
);
