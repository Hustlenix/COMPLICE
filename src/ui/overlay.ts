import type { CompanionState, StateMachine } from '../state/appState';

const gate = document.querySelector<HTMLDivElement>('#gate');
const enterButton = document.querySelector<HTMLButtonElement>('#enter');
const statusPill = document.querySelector<HTMLSpanElement>('#status');
const caption = document.querySelector<HTMLParagraphElement>('#caption');

const LABELS: Record<CompanionState, string> = {
  idle: 'Idle',
  listening: 'Listening',
  thinking: 'Thinking',
  speaking: 'Speaking',
};

export function setStatus(state: CompanionState): void {
  if (!statusPill) return;
  statusPill.textContent = LABELS[state];
  statusPill.dataset.state = state;
}

export function setCaption(text: string): void {
  if (!caption) return;
  caption.textContent = text;
}

export function bindOverlay(machine: StateMachine): void {
  setStatus(machine.get());
  machine.subscribe(setStatus);

  if (!gate || !enterButton) return;

  let entered = false;

  enterButton.addEventListener('click', () => {
    if (entered) return;
    entered = true;

    gate.classList.add('gate--hidden');
    document.body.dataset.entered = 'true';
    window.dispatchEvent(new CustomEvent('complice:enter'));
    document.querySelector<HTMLCanvasElement>('#scene')?.focus();
  });
}
