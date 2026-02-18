import { apiClient } from './client';
import type { Device } from '../types';

const DEVICES_PATH = '/api/v1/a/devices/';

/**
 * Получить список устройств.
 */
export async function fetchDevices(): Promise<Device[]> {
  const { data } = await apiClient.get<Device[]>(DEVICES_PATH);
  return Array.isArray(data) ? data : [];
}
