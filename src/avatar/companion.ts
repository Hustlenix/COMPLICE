import * as THREE from 'three';
import type { CompanionState } from '../state/appState';

export interface Companion {
  group: THREE.Group;
  update(time: number, state: CompanionState, reducedMotion: boolean): void;
}

export function buildCompanion(): Companion {
  const group = new THREE.Group();
  group.name = 'companion';

  const skin = new THREE.MeshStandardMaterial({
    color: 0xc98e6b,
    roughness: 0.85,
  });
  const top = new THREE.MeshStandardMaterial({
    color: 0x556b7a,
    roughness: 0.9,
  });
  const hair = new THREE.MeshStandardMaterial({
    color: 0x2b1d16,
    roughness: 0.9,
  });
  const eye = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.4,
  });

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.21, 0.42, 8, 16), top);
  body.position.y = 1.03;
  group.add(body);

  const trousers = new THREE.MeshStandardMaterial({
    color: 0x2f3b46,
    roughness: 0.95,
  });
  const legGeometry = new THREE.CapsuleGeometry(0.075, 0.5, 6, 12);
  for (const x of [-0.1, 0.1]) {
    const leg = new THREE.Mesh(legGeometry, trousers);
    leg.position.set(x, 0.36, 0);
    group.add(leg);
  }

  const neck = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.08, 4, 8), skin);
  neck.position.y = 1.4;
  group.add(neck);

  const headGroup = new THREE.Group();
  headGroup.position.y = 1.42;

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 32, 24), skin);
  head.position.y = 0.18;
  headGroup.add(head);

  const hairCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.172, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.38),
    hair
  );
  hairCap.position.y = 0.185;
  headGroup.add(hairCap);

  const backHair = new THREE.Mesh(
    new THREE.SphereGeometry(0.168, 32, 16, Math.PI * 0.55, Math.PI * 0.9, 0, Math.PI * 0.62),
    hair
  );
  backHair.position.set(0, 0.16, -0.02);
  headGroup.add(backHair);

  const eyeGeometry = new THREE.SphereGeometry(0.021, 12, 8);
  const leftEye = new THREE.Mesh(eyeGeometry, eye);
  leftEye.position.set(-0.056, 0.195, 0.15);

  const rightEye = new THREE.Mesh(eyeGeometry, eye);
  rightEye.position.set(0.056, 0.195, 0.15);

  headGroup.add(leftEye, rightEye);

  const smile = new THREE.Mesh(
    new THREE.TorusGeometry(0.045, 0.007, 8, 18, Math.PI),
    eye
  );
  smile.position.set(0, 0.135, 0.152);
  smile.rotation.z = Math.PI;
  headGroup.add(smile);

  group.add(headGroup);

  const armGeometry = new THREE.CapsuleGeometry(0.05, 0.3, 6, 10);
  const leftArm = new THREE.Mesh(armGeometry, skin);
  leftArm.position.set(-0.28, 1.09, 0);
  leftArm.rotation.z = 0.18;

  const rightArm = new THREE.Mesh(armGeometry, skin);
  rightArm.position.set(0.28, 1.09, 0);
  rightArm.rotation.z = -0.18;

  group.add(leftArm, rightArm);

  return {
    group,
    update(time, state, reducedMotion) {
      if (reducedMotion) {
        headGroup.rotation.set(0, 0, 0);
        leftEye.scale.y = 1;
        rightEye.scale.y = 1;
        group.position.y = 0;
        return;
      }

      group.position.y = Math.sin(time * 1.6) * 0.006;

      const blink = time % 4.2 < 0.09 ? 0.08 : 1;
      leftEye.scale.y = blink;
      rightEye.scale.y = blink;

      if (state === 'listening') {
        headGroup.rotation.z = 0.12;
        headGroup.rotation.x = 0.05;
      } else if (state === 'speaking') {
        headGroup.rotation.x = Math.sin(time * 5) * 0.05;
        headGroup.rotation.z = 0;
      } else if (state === 'thinking') {
        headGroup.rotation.z = -0.08;
        headGroup.rotation.x = 0.02;
      } else {
        headGroup.rotation.z *= 0.9;
        headGroup.rotation.x *= 0.9;
      }
    },
  };
}
