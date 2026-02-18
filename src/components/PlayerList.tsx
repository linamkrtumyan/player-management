import { memo } from 'react';
import { Spinner, Alert, Badge, Stack, Card, Row, Col } from 'react-bootstrap';
import { BalanceOperations } from './BalanceOperations';
import { MoneyIcon } from './icons';
import type { Player } from '../types';

interface PlayerListProps {
  players: Player[];
  isLoading: boolean;
  error: Error | null;
  deviceName: string;
  onDeposit: (deviceId: number, placeId: number, amount: number) => Promise<void>;
  onWithdraw: (deviceId: number, placeId: number, amount: number) => Promise<void>;
}

function PlayerListComponent({
  players,
  isLoading,
  error,
  deviceName,
  onDeposit,
  onWithdraw,
}: PlayerListProps) {
  if (error) {
    return (
      <Alert variant="danger" className="mb-0">
        {error.message}
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Stack className="align-items-center py-5">
        <Spinner animation="border" role="status" variant="primary" />
        <span className="visually-hidden">Загрузка игроков...</span>
      </Stack>
    );
  }

  if (players.length === 0) {
    return (
      <Alert variant="secondary" className="mb-0">
        На этом устройстве нет игроков.
      </Alert>
    );
  }

  return (
    <div className="player-list">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="mb-0 fw-semibold" style={{ fontSize: '1.125rem', color: '#111827' }}>
          {deviceName}
        </h5>
      </div>

      <Stack gap={3}>
        {players.map((player) => (
          <Card key={player.id} className="player-card shadow-sm">
            <Card.Body className="py-3">
              <Row className="g-3 align-items-start align-items-md-center">
                {/* Left: name + balance */}
                <Col xs={12} md={5} lg={4}>
                  <div className="d-flex flex-column gap-2">
                    <div className="fw-semibold" style={{ fontSize: 16, color: '#111827' }}>
                      {player.name}
                    </div>

                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <Badge
                        bg={player.balance >= 0 ? 'success' : 'danger'}
                        className="d-inline-flex align-items-center gap-1 player-balance-badge"
                      >
                        <MoneyIcon />
                        <span className="opacity-75">Баланс:</span>
                        <strong>{formatBalance(player.balance)}</strong>
                        <span className="opacity-75">{player.currency}</span>
                      </Badge>
                    </div>
                  </div>
                </Col>

                {/* Right: operations */}
                <Col xs={12} md={7} lg={8}>
                    <BalanceOperations
                      player={player}
                      onDeposit={onDeposit}
                      onWithdraw={onWithdraw}
                    />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))}
      </Stack>
    </div>
  );
}

function formatBalance(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export const PlayerList = memo(PlayerListComponent);
