import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { AboutPage } from './pages/About';
import { EventsPage } from './pages/EventsPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App>
        <Routes>
          <Route path="/" element={<EventsPage mode="upcoming" />} />
          <Route path="/past" element={<EventsPage mode="past" />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </App>
    </BrowserRouter>
  </StrictMode>
);
