import { memo, Suspense } from 'react';
import { Container, Button, Spinner, Card, Stack } from 'react-bootstrap';
import { PlayerList } from '../components/PlayerList';
import { ArrowLeftIcon, UsersIcon } from '../components/icons';
import { usePlayers } from '../hooks/usePlayers';
import type { Device } from '../types';

interface PlayersPageProps {
  device: Device;
  onBack: () => void;
  onDeposit: (deviceId: number, placeId: number, amount: number) => Promise<void>;
  onWithdraw: (deviceId: number, placeId: number, amount: number) => Promise<void>;
}

function PlayersPageComponent({
  device,
  onBack,
  onDeposit,
  onWithdraw,
}: PlayersPageProps) {
  const {
    data: players = [],
    isLoading,
    error,
  } = usePlayers(device.id, true);

  return (
    <Container className="py-3 py-md-4">
      <Card className="section-card players-page-card">
        <Card.Header className="bg-transparent border-bottom pb-3 mb-3">
          <Stack direction="horizontal" gap={3} className="justify-content-between align-items-center flex-wrap">
            <Button
              variant="outline-secondary"
              onClick={onBack}
              className="back-button d-flex align-items-center gap-2"
            >
              <ArrowLeftIcon /> <span className="d-none d-sm-inline">Назад к устройствам</span><span className="d-sm-none">Назад</span>
            </Button>
            <Card.Title as="h2" className="h6 mb-0 fw-semibold d-flex align-items-center gap-2 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', color: '#6b7280' }}>
              <UsersIcon /> <span className="d-none d-sm-inline">Игроки устройства</span><span className="d-sm-none">Игроки</span>
            </Card.Title>
          </Stack>
        </Card.Header>
        <Card.Body>
        <Suspense
          fallback={
            <Stack className="align-items-center py-5">
              <Spinner animation="border" variant="primary" />
              <span className="visually-hidden">Загрузка...</span>
            </Stack>
          }
        >
            <PlayerList
              players={players}
              isLoading={isLoading}
              error={error ?? null}
              deviceName={device.name}
              onDeposit={onDeposit}
              onWithdraw={onWithdraw}
            />
          </Suspense>
        </Card.Body>
      </Card>
    </Container>
  );
}

export const PlayersPage = memo(PlayersPageComponent);
