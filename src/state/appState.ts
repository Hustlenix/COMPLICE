export type CompanionState = 'idle' | 'listening' | 'thinking' | 'speaking';

const ALLOWED: Record<CompanionState, readonly CompanionState[]> = {
  idle: ['listening'],
  listening: ['thinking', 'idle'],
  thinking: ['speaking', 'idle'],
  speaking: ['idle', 'listening'],
};

export type StateListener = (state: CompanionState) => void;

export interface StateMachine {
  get(): CompanionState;
  can(next: CompanionState): boolean;
  transition(next: CompanionState): void;
  subscribe(listener: StateListener): () => void;
}

export function createStateMachine(initial: CompanionState = 'idle'): StateMachine {
  let current = initial;
  const listeners = new Set<StateListener>();

  return {
    get: () => current,
    can: (next) => ALLOWED[current].includes(next),
    transition(next) {
      if (!ALLOWED[current].includes(next)) {
        throw new Error(`Invalid transition ${current} -> ${next}`);
      }
      current = next;
      for (const listener of listeners) {
        listener(current);
      }
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
