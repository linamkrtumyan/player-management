/**
 * Генерация случайных имён игроков.
 * Использует детерминированный подход на основе ID места для стабильности:
 * одно и то же место всегда получает одно и то же имя в рамках сессии.
 */

const FIRST_NAMES = [
  'Алексей', 'Дмитрий', 'Иван', 'Михаил', 'Андрей', 'Сергей', 'Николай',
  'Владимир', 'Александр', 'Павел', 'Роман', 'Егор', 'Артём', 'Максим',
  'Анна', 'Мария', 'Елена', 'Ольга', 'Татьяна', 'Наталья', 'Ирина',
  'Светлана', 'Екатерина', 'Юлия', 'Анастасия', 'Дарья', 'Виктория',
];

const LAST_NAMES = [
  'Иванов', 'Петров', 'Сидоров', 'Смирнов', 'Кузнецов', 'Попов', 'Соколов',
  'Лебедев', 'Козлов', 'Новиков', 'Морозов', 'Петухов', 'Волков', 'Соловьёв',
  'Васильев', 'Зайцев', 'Павлов', 'Семёнов', 'Голубев', 'Виноградов',
];

// Кэш имён для стабильности в рамках сессии
const nameCache = new Map<string, string>();

/**
 * Генерирует случайное имя игрока на основе deviceId и place.
 * Одно и то же место всегда получает одно и то же имя.
 */
export function generatePlayerName(deviceId: number, place: number): string {
  const key = `${deviceId}-${place}`;
  
  if (nameCache.has(key)) {
    return nameCache.get(key)!;
  }

  // Простой детерминированный генератор на основе ключа
  const seed = deviceId * 1000 + place;
  const firstNameIndex = seed % FIRST_NAMES.length;
  const lastNameIndex = (seed * 7) % LAST_NAMES.length;
  
  const name = `${FIRST_NAMES[firstNameIndex]} ${LAST_NAMES[lastNameIndex]}`;
  nameCache.set(key, name);
  
  return name;
}
