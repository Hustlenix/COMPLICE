import * as THREE from 'three';

export function buildRoom(scene: THREE.Scene): void {
  const room = new THREE.Group();
  room.name = 'room';

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 6),
    new THREE.MeshStandardMaterial({ color: 0x5d4433, roughness: 0.95 })
  );
  floor.rotation.x = -Math.PI / 2;
  room.add(floor);

  const rug = new THREE.Mesh(
    new THREE.CircleGeometry(0.95, 48),
    new THREE.MeshStandardMaterial({ color: 0x8a5545, roughness: 1 })
  );
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0, 0.005, -0.7);
  room.add(rug);

  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0xe4d6c6,
    roughness: 1,
  });

  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(6, 3), wallMaterial);
  backWall.position.set(0, 1.5, -3);
  room.add(backWall);

  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(6, 3), wallMaterial);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.set(-3, 1.5, 0);
  room.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(6, 3), wallMaterial);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.position.set(3, 1.5, 0);
  room.add(rightWall);

  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 6),
    new THREE.MeshStandardMaterial({ color: 0x3a2c22, roughness: 1 })
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = 3;
  room.add(ceiling);

  const windowGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 1.1),
    new THREE.MeshStandardMaterial({
      color: 0x2a4a63,
      emissive: 0x6a93b8,
      emissiveIntensity: 0.55,
    })
  );
  windowGlass.position.set(1.1, 1.7, -2.99);
  room.add(windowGlass);

  const desk = new THREE.Group();
  desk.position.set(-1.7, 0, -2.2);

  const desktop = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.06, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x3f2c20, roughness: 0.8 })
  );
  desktop.position.y = 0.75;
  desk.add(desktop);

  const legMaterial = new THREE.MeshStandardMaterial({
    color: 0x2b1e16,
    roughness: 0.9,
  });
  for (const x of [-0.6, 0.6]) {
    for (const z of [-0.22, 0.22]) {
      const leg = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.75, 0.05),
        legMaterial
      );
      leg.position.set(x, 0.375, z);
      desk.add(leg);
    }
  }

  const metal = new THREE.MeshStandardMaterial({
    color: 0x8a7a6a,
    roughness: 0.5,
  });

  const lampBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.11, 0.03, 24),
    metal
  );
  lampBase.position.set(0.45, 0.795, 0);

  const lampStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 0.35, 12),
    metal
  );
  lampStem.position.set(0.45, 0.985, 0);

  const lampShade = new THREE.Mesh(
    new THREE.ConeGeometry(0.16, 0.14, 24, 1, true),
    new THREE.MeshStandardMaterial({
      color: 0xd9a15e,
      emissive: 0x7a4a1e,
      emissiveIntensity: 0.6,
      side: THREE.DoubleSide,
    })
  );
  lampShade.position.set(0.45, 1.18, 0);

  const bulb = new THREE.PointLight(0xffc98a, 3.2, 5.5, 2);
  bulb.position.set(0.45, 1.1, 0);

  desk.add(lampBase, lampStem, lampShade, bulb);
  room.add(desk);

  const ambient = new THREE.HemisphereLight(0xffe7cf, 0x2a1d14, 0.9);
  room.add(ambient);

  const fill = new THREE.PointLight(0xffe3c8, 1.6, 9, 2);
  fill.position.set(0, 2.1, 2.2);
  room.add(fill);

  scene.add(room);
}
