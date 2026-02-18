import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchPlayersByDevice,
  deposit as apiDeposit,
  withdraw as apiWithdraw,
  getErrorMessage,
} from '../api';

const PLAYERS_QUERY_KEY_PREFIX = ['players'] as const;

function playersQueryKey(deviceId: number | string | null) {
  return [...PLAYERS_QUERY_KEY_PREFIX, String(deviceId ?? '')] as const;
}

export function usePlayers(deviceId: number | null, enabled: boolean) {
  return useQuery({
    queryKey: playersQueryKey(deviceId),
    queryFn: () => fetchPlayersByDevice(deviceId!),
    enabled: enabled && !!deviceId,
  });
}

export function useBalanceMutations(deviceId: number | null, onError: (msg: string) => void) {
  const queryClient = useQueryClient();

  const invalidatePlayers = () => {
    if (deviceId) {
      void queryClient.invalidateQueries({ queryKey: playersQueryKey(deviceId) });
    }
  };

  /**
   * Пополнить баланс игрока.
   * @param deviceId - ID устройства
   * @param placeId - ID места (place)
   * @param amount - Сумма пополнения (положительное число)
   */
  const deposit = async (deviceId: number, placeId: number, amount: number) => {
    try {
      const response = await apiDeposit(deviceId, placeId, amount);
      invalidatePlayers();
      return response;
    } catch (e) {
      onError(getErrorMessage(e));
      throw e;
    }
  };

  /**
   * Снять средства с баланса игрока.
   * @param deviceId - ID устройства
   * @param placeId - ID места (place)
   * @param amount - Сумма снятия (положительное число, будет преобразовано в отрицательный delta)
   */
  const withdraw = async (deviceId: number, placeId: number, amount: number) => {
    try {
      const response = await apiWithdraw(deviceId, placeId, amount);
      invalidatePlayers();
      return response;
    } catch (e) {
      onError(getErrorMessage(e));
      throw e;
    }
  };

  return { deposit, withdraw };
}
