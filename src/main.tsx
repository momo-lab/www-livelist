import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ReactGA from 'react-ga4';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { AboutPage } from '@/pages/About';
import { CalendarPage } from '@/pages/CalendarPage';
import { MembersPage } from '@/pages/MembersPage';
import { PastEventsPage } from '@/pages/PastEventsPage';
import { UpcomingEventsPage } from '@/pages/UpcomingEventsPage';
import { LiveEventsProvider } from '@/providers/LiveEventsProvider';

const ga4Id = import.meta.env.VITE_GA4_ID;
if (ga4Id) {
  ReactGA.initialize(ga4Id);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <LiveEventsProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<UpcomingEventsPage />} />
            <Route path="past" element={<PastEventsPage />} />
            <Route path="cal" element={<CalendarPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="members" element={<MembersPage />} />
          </Route>
        </Routes>
      </LiveEventsProvider>
    </BrowserRouter>
  </StrictMode>
);
