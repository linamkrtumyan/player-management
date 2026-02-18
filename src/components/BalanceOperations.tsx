import { memo, useState, useCallback } from 'react';
import { Form, Button, Card, ButtonGroup, Spinner } from 'react-bootstrap';
import { validateAmount } from '../utils/validation';
import type { Player } from '../types';

interface BalanceOperationsProps {
  player: Player;
  onDeposit: (deviceId: number, placeId: number, amount: number) => Promise<void>;
  onWithdraw: (deviceId: number, placeId: number, amount: number) => Promise<void>;
  disabled?: boolean;
}

/**
 * Поле ввода суммы и кнопки Deposit / Withdraw с валидацией.
 * 
 * Валидация суммы (не более 2 знаков после запятой) критически важна в финансовых приложениях по следующим причинам:
 * 1. Соответствие реальным валютам — большинство валют имеют 2 знака (копейки, центы).
 * 2. Предсказуемость расчётов — избегаем ошибок округления и накопления погрешности float.
 * 3. Защита от некорректного ввода и опечаток (например, 100.567 вместо 100.56).
 * 4. Единообразие с бэкендом и отчётностью — одна и та же точность везде.
 * 5. Соответствие стандартам финансовых систем и банковских протоколов.
 */
function BalanceOperationsComponent({
  player,
  onDeposit,
  onWithdraw,
  disabled = false,
}: BalanceOperationsProps) {
  const [amountInput, setAmountInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [loadingOp, setLoadingOp] = useState<'deposit' | 'withdraw' | null>(null);

  /**
   * Валидация поля ввода в реальном времени.
   * Проверяет формат суммы (не более 2 знаков после запятой) и показывает ошибки пользователю.
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setAmountInput(value);
      
      // Очищаем ошибку если поле пустое
      if (value.trim() === '') {
        setValidationError(null);
        return;
      }
      
      // Валидируем введённое значение и показываем ошибку если есть
      const result = validateAmount(value);
      setValidationError(result.valid ? null : result.error ?? null);
    },
    []
  );

  /**
   * Выполняет операцию с балансом (Deposit или Withdraw).
   * 
   * Обработка ошибок:
   * 1. Валидация поля ввода - проверка формата суммы перед отправкой
   * 2. Ошибки от сервера (недостаточно средств, некорректная сумма) - показываются через toast в родителе
   * 3. Понятные сообщения об ошибках для пользователя
   */
  const runOperation = useCallback(
    async (op: 'deposit' | 'withdraw') => {
      // Валидация перед отправкой - проверяем формат суммы
      const result = validateAmount(amountInput);
      if (!result.valid || result.value == null) {
        // Показываем ошибку валидации под полем ввода
        setValidationError(result.error ?? 'Некорректная сумма');
        return;
      }
      
      setLoadingOp(op);
      setValidationError(null);
      
      try {
        if (op === 'deposit') {
          await onDeposit(player.deviceId, player.place, result.value);
        } else {
          await onWithdraw(player.deviceId, player.place, result.value);
        }
        // Очищаем поле ввода только при успешной операции
        setAmountInput('');
      } catch (error) {
        // Ошибки от сервера (недостаточно средств, некорректная сумма и т.д.)
        // обрабатываются и показываются через toast в родительском компоненте (App.tsx)
        // через useBalanceMutations -> showError
        // Здесь мы просто не очищаем поле, чтобы пользователь мог исправить сумму
      } finally {
        setLoadingOp(null);
      }
    },
    [amountInput, player.deviceId, player.place, onDeposit, onWithdraw]
  );

  const isInvalid = validationError != null;
  const isBusy = loadingOp != null;

  return (
    <Card className="balance-operations">
      <Card.Body className="p-3">
        <Form>
          <Form.Group className="mb-0">
            <Form.Label className="small text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', color: '#6b7280', fontWeight: 600 }}>Сумма</Form.Label>
            <div className="balance-input-wrapper">
              <Form.Control
                type="text"
                inputMode="decimal"
                placeholder="Например, 100.50"
                value={amountInput}
                onChange={handleInputChange}
                isInvalid={isInvalid}
                disabled={disabled || isBusy}
                aria-describedby={isInvalid ? 'amount-error' : undefined}
                className="balance-input-field"
              />
              <div className="balance-buttons-wrapper">
                <ButtonGroup className="balance-button-group">
                  <Button
                    variant="success"
                    onClick={() => runOperation('deposit')}
                    disabled={disabled || isBusy || isInvalid || !amountInput.trim()}
                    className="balance-btn"
                  >
                    {loadingOp === 'deposit' ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-1" />
                        <span className="visually-hidden">Обработка...</span>
                      </>
                    ) : null}
                    Deposit
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => runOperation('withdraw')}
                    disabled={disabled || isBusy || isInvalid || !amountInput.trim()}
                    className="balance-btn"
                  >
                    {loadingOp === 'withdraw' ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-1" />
                        <span className="visually-hidden">Обработка...</span>
                      </>
                    ) : null}
                    Withdraw
                  </Button>
                </ButtonGroup>
              </div>
            </div>
            {validationError && (
              <Form.Control.Feedback type="invalid" id="amount-error" className="d-block mt-2">
                {validationError}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
}

export const BalanceOperations = memo(BalanceOperationsComponent);
