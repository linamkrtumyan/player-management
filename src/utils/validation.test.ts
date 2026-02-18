import { describe, it, expect } from 'vitest';
import { validateAmount } from './validation';

describe('validateAmount', () => {
  it('допускает сумму с двумя знаками после запятой (100.50)', () => {
    const result = validateAmount('100.50');
    expect(result.valid).toBe(true);
    expect(result.value).toBe(100.5);
  });

  it('отклоняет более двух знаков после запятой (100.567)', () => {
    const result = validateAmount('100.567');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/не более 2 знаков/);
  });

  it('отклоняет пустую строку', () => {
    const result = validateAmount('');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/Введите сумму/);
  });

  it('отклоняет нечисловой ввод', () => {
    const result = validateAmount('abc');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/числом/);
  });

  it('отклоняет нуль и отрицательные значения', () => {
    expect(validateAmount('0').valid).toBe(false);
    expect(validateAmount('-10').valid).toBe(false);
  });

  it('допускает целое число', () => {
    const result = validateAmount('100');
    expect(result.valid).toBe(true);
    expect(result.value).toBe(100);
  });
});
