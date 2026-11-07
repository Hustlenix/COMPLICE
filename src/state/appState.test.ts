import { describe, expect, it, vi } from 'vitest';
import { createStateMachine } from './appState';

describe('createStateMachine', () => {
  it('walks the full conversation cycle', () => {
    const machine = createStateMachine();

    machine.transition('listening');
    machine.transition('thinking');
    machine.transition('speaking');
    machine.transition('idle');

    expect(machine.get()).toBe('idle');
  });

  it('rejects skipping straight from idle to speaking', () => {
    const machine = createStateMachine();

    expect(() => machine.transition('speaking')).toThrow(
      'Invalid transition idle -> speaking'
    );
  });

  it('allows interrupting speech and returning to listening', () => {
    const machine = createStateMachine('listening');

    machine.transition('thinking');
    machine.transition('speaking');
    machine.transition('listening');

    expect(machine.get()).toBe('listening');
  });

  it('notifies subscribers and stops after unsubscribe', () => {
    const machine = createStateMachine();
    const listener = vi.fn();

    const unsubscribe = machine.subscribe(listener);
    machine.transition('listening');
    expect(listener).toHaveBeenCalledWith('listening');

    unsubscribe();
    machine.transition('idle');
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
