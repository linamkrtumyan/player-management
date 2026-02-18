import { useState, useCallback } from 'react';
import { Navbar, Container as BootstrapContainer } from 'react-bootstrap';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider, useToast } from './context/ToastContext';
import { DevicesPage } from './pages/DevicesPage';
import { PlayersPage } from './pages/PlayersPage';
import { useBalanceMutations } from './hooks/usePlayers';
import type { Device } from './types';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

type Page = 'devices' | 'players';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('devices');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const { showError, showSuccess } = useToast();

  const { deposit, withdraw } = useBalanceMutations(
    selectedDevice?.id ?? null,
    showError
  );

  const handleSelectDevice = useCallback((device: Device) => {
    setSelectedDevice(device);
    setCurrentPage('players');
  }, []);

  const handleBack = useCallback(() => {
    setCurrentPage('devices');
    setSelectedDevice(null);
  }, []);

  const handleDeposit = useCallback(
    async (deviceId: number, placeId: number, amount: number) => {
      try {
        const response = await deposit(deviceId, placeId, amount);
        const formattedAmount = amount.toFixed(2);
        const formattedBalance = response.balances.toFixed(2);
        showSuccess(
          `Баланс пополнен на ${formattedAmount} ${response.currency}. Новый баланс: ${formattedBalance} ${response.currency}`
        );
      } catch (error) {
        // Ошибки обрабатываются в useBalanceMutations через showError
      }
    },
    [deposit, showSuccess]
  );

  const handleWithdraw = useCallback(
    async (deviceId: number, placeId: number, amount: number) => {
      try {
        const response = await withdraw(deviceId, placeId, amount);
        const formattedAmount = amount.toFixed(2);
        const formattedBalance = response.balances.toFixed(2);
        showSuccess(
          `Снято ${formattedAmount} ${response.currency}. Новый баланс: ${formattedBalance} ${response.currency}`
        );
      } catch (error) {
        // Ошибки обрабатываются в useBalanceMutations через showError
      }
    },
    [withdraw, showSuccess]
  );

  return (
    <div className="app-container">
      <Navbar bg="white" expand="lg" className="app-header shadow-sm" sticky="top">
        <BootstrapContainer fluid>
          <Navbar.Brand className="app-title">
            Управление балансами игроков
          </Navbar.Brand>
        </BootstrapContainer>
      </Navbar>
      <div className={`page-container page-${currentPage}`}>
        {currentPage === 'devices' ? (
          <DevicesPage
            selectedId={selectedDevice?.id ?? null}
            onSelectDevice={handleSelectDevice}
          />
        ) : selectedDevice ? (
          <PlayersPage
            device={selectedDevice}
            onBack={handleBack}
            onDeposit={handleDeposit}
            onWithdraw={handleWithdraw}
          />
        ) : null}
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
