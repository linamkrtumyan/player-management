import { useQuery } from '@tanstack/react-query';
import { fetchDevices } from '../api';

const DEVICES_QUERY_KEY = ['devices'] as const;

export function useDevices() {
  return useQuery({
    queryKey: DEVICES_QUERY_KEY,
    queryFn: fetchDevices,
  });
}
