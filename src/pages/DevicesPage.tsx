import { memo } from 'react';
import { Container, Card } from 'react-bootstrap';
import { DeviceList } from '../components';
import { DeviceIcon } from '../components/icons';
import { useDevices } from '../hooks/useDevices';
import type { Device } from '../types';

interface DevicesPageProps {
  selectedId: number | null;
  onSelectDevice: (device: Device) => void;
}

function DevicesPageComponent({ selectedId, onSelectDevice }: DevicesPageProps) {
  const { data: devices = [], isLoading, error } = useDevices();

  return (
    <Container className="py-3 py-md-4">
      <Card className="section-card devices-page-card">
        <Card.Header className="bg-transparent border-bottom pb-3 mb-3">
          <Card.Title as="h2" className="h6 mb-0 fw-semibold d-flex align-items-center gap-2 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', color: '#6b7280' }}>
            <DeviceIcon /> Выберите устройство
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <DeviceList
            devices={devices}
            isLoading={isLoading}
            error={error ?? null}
            selectedId={selectedId}
            onSelect={onSelectDevice}
          />
        </Card.Body>
      </Card>
    </Container>
  );
}

export const DevicesPage = memo(DevicesPageComponent);
