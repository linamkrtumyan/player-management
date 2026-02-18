import { apiClient } from './client';
import type {
  Device,
  Player,
  UpdateBalanceRequest,
  BalanceOperationResponse,
} from '../types';
import { generatePlayerName } from '../utils/playerNames';

/**
 * Получить устройство по ID и преобразовать places в игроков.
 */
export async function fetchPlayersByDevice(deviceId: string | number): Promise<Player[]> {
  const { data } = await apiClient.get<Device>(
    `/api/v1/a/devices/${encodeURIComponent(deviceId)}/`
  );
  
  if (!data.places || !Array.isArray(data.places)) {
    return [];
  }

  // Преобразуем places в players с случайными именами
  return data.places.map((place) => ({
    id: `${data.id}-${place.place}`,
    name: generatePlayerName(data.id, place.place),
    balance: place.balances,
    currency: place.currency,
    deviceId: data.id,
    place: place.place,
  }));
}

/**
 * Обновить баланс для устройства и места.
 * Эндпоинт: POST /api/v1/a/devices/{device_id}/place/{place_id}/update
 * 
 * @param deviceId - ID устройства
 * @param placeId - ID места (place)
 * @param delta - Изменение баланса (положительное для пополнения, отрицательное для снятия)
 * @returns Обновлённый баланс и данные места
 */
export async function updateBalance(
  deviceId: number,
  placeId: number,
  delta: number
): Promise<BalanceOperationResponse> {
  const requestBody: UpdateBalanceRequest = { delta };
  const { data } = await apiClient.post<BalanceOperationResponse>(
    `/api/v1/a/devices/${encodeURIComponent(deviceId)}/place/${encodeURIComponent(placeId)}/update`,
    requestBody
  );
  return data;
}

/**
 * Пополнить баланс игрока (Deposit).
 * Использует updateBalance с положительным delta.
 */
export async function deposit(
  deviceId: number,
  placeId: number,
  amount: number
): Promise<BalanceOperationResponse> {
  return updateBalance(deviceId, placeId, amount);
}

/**
 * Снять средства с баланса игрока (Withdraw).
 * Использует updateBalance с отрицательным delta.
 */
export async function withdraw(
  deviceId: number,
  placeId: number,
  amount: number
): Promise<BalanceOperationResponse> {
  return updateBalance(deviceId, placeId, -amount);
}
