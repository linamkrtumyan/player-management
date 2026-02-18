
/** Место (place) на устройстве с балансом */
export interface Place {
  device_id: number;
  place: number;
  currency: string;
  balances: number;
}

/** Устройство из списка устройств */
export interface Device {
  id: number;
  name: string;
  places: Place[];
  created_at?: string;
  updated_at?: string;
}

/** Игрок с балансом (генерируется из Place) */
export interface Player {
  id: string; // Составной ID: "deviceId-place"
  name: string; // Случайно сгенерированное имя
  balance: number; // Из balances
  currency: string; // Из currency
  deviceId: number;
  place: number;
}

/** Запрос на обновление баланса (delta: положительное для deposit, отрицательное для withdraw) */
export interface UpdateBalanceRequest {
  delta: number;
}

/** Ответ API при успешной операции с балансом (200 OK) */
export interface BalanceOperationResponse {
  balances: number;
  currency: string;
  device_id: number;
  place: number;
}

/** Ошибка от сервера (400, 401, 408, 500) */
export interface ApiErrorBody {
  data?: string;
  err: string; // Основное поле с сообщением об ошибке
}
