import { memo } from 'react';
import { ListGroup, Spinner, Alert, Stack } from 'react-bootstrap';
import type { Device } from '../types';

interface DeviceListProps {
  devices: Device[];
  isLoading: boolean;
  error: Error | null;
  selectedId: number | null;
  onSelect: (device: Device) => void;
}

function DeviceListComponent({
  devices,
  isLoading,
  error,
  selectedId,
  onSelect,
}: DeviceListProps) {
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
        <span className="visually-hidden">Загрузка...</span>
      </Stack>
    );
  }

  if (devices.length === 0) {
    return (
      <Alert variant="secondary" className="mb-0">
        Нет доступных устройств.
      </Alert>
    );
  }

  return (
    <ListGroup as="ul">
      {devices.map((device) => (
        <ListGroup.Item
          key={device.id}
          as="li"
          action
          active={selectedId === device.id}
          onClick={() => onSelect(device)}
          className="device-item"
        >
          {device.name}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export const DeviceList = memo(DeviceListComponent);
