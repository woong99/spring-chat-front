import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

Modal.setAppElement('#root');
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
