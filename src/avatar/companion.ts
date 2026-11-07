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

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.5, 8, 16), top);
  body.position.y = 1.0;
  group.add(body);

  const neck = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.08, 4, 8), skin);
  neck.position.y = 1.36;
  group.add(neck);

  const headGroup = new THREE.Group();
  headGroup.position.y = 1.38;

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 32, 24), skin);
  head.position.y = 0.18;
  headGroup.add(head);

  const hairCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.17, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.55),
    hair
  );
  hairCap.position.y = 0.2;
  headGroup.add(hairCap);

  const eyeGeometry = new THREE.SphereGeometry(0.018, 12, 8);
  const leftEye = new THREE.Mesh(eyeGeometry, eye);
  leftEye.position.set(-0.055, 0.19, 0.148);

  const rightEye = new THREE.Mesh(eyeGeometry, eye);
  rightEye.position.set(0.055, 0.19, 0.148);

  headGroup.add(leftEye, rightEye);
  group.add(headGroup);

  const armGeometry = new THREE.CapsuleGeometry(0.05, 0.3, 6, 10);
  const leftArm = new THREE.Mesh(armGeometry, skin);
  leftArm.position.set(-0.3, 1.05, 0);
  leftArm.rotation.z = 0.18;

  const rightArm = new THREE.Mesh(armGeometry, skin);
  rightArm.position.set(0.3, 1.05, 0);
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
