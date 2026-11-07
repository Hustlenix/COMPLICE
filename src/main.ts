import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildRoom } from './scene/room';
import { buildCompanion } from './avatar/companion';
import { createStateMachine } from './state/appState';
import { bindOverlay, setCaption, setStatus } from './ui/overlay';
import './styles.css';

const canvas = document.querySelector<HTMLCanvasElement>('#scene');

if (!canvas) {
  throw new Error('Scene canvas is missing from index.html');
}

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1c1410);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.05,
  100
);
camera.position.set(0, 1.55, 2.9);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.15, -0.7);
controls.enableDamping = true;
controls.maxDistance = 5.5;
controls.minDistance = 1.6;
controls.minPolarAngle = Math.PI * 0.28;
controls.maxPolarAngle = Math.PI * 0.55;

buildRoom(scene);

const companion = buildCompanion();
companion.group.position.set(0, 0, -0.7);
scene.add(companion.group);

const xrSlot = document.querySelector<HTMLDivElement>('#xr-slot');
const xrButton = VRButton.createButton(renderer);
if (xrSlot) {
  xrSlot.appendChild(xrButton);
} else {
  document.body.appendChild(xrButton);
}

const machine = createStateMachine('idle');
bindOverlay(machine);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

renderer.xr.addEventListener('sessionstart', () => {
  controls.enabled = false;
});

renderer.xr.addEventListener('sessionend', () => {
  controls.enabled = true;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

let hasEntered = false;
window.addEventListener('complice:enter', () => {
  hasEntered = true;
});

const LOOK_STEP = THREE.MathUtils.degToRad(6);

window.addEventListener('keydown', (event) => {
  if (!hasEntered) return;

  const offset = camera.position.clone().sub(controls.target);
  const spherical = new THREE.Spherical().setFromVector3(offset);

  switch (event.key) {
    case 'ArrowLeft':
      spherical.theta -= LOOK_STEP;
      break;
    case 'ArrowRight':
      spherical.theta += LOOK_STEP;
      break;
    case 'ArrowUp':
      spherical.phi = Math.max(0.35, spherical.phi - LOOK_STEP);
      break;
    case 'ArrowDown':
      spherical.phi = Math.min(1.5, spherical.phi + LOOK_STEP);
      break;
    default:
      return;
  }

  event.preventDefault();
  camera.position
    .copy(controls.target)
    .add(new THREE.Vector3().setFromSpherical(spherical));
  controls.update();
});

renderer.setAnimationLoop((time) => {
  companion.update(time / 1000, machine.get(), reducedMotion);
  controls.update();
  renderer.render(scene, camera);
});

window.addEventListener('complice:enter', () => {
  setStatus('idle');

  const lines = [
    'She looks up from her book. "Oh — hello. I\'m COMPLICE. I\'m an AI, in case that matters."',
    '"It\'s quiet in here. What should we do with the next ten minutes?"',
  ];

  let index = 0;
  setCaption(lines[index]);

  const timer = window.setInterval(() => {
    index += 1;
    if (index >= lines.length) {
      window.clearInterval(timer);
      return;
    }
    setCaption(lines[index]);
  }, 4200);
});
