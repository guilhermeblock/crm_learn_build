import * as THREE from "three";

/**
 * Tubo que afina ao longo da curva (raiz r0 → ponta r1), como um dendrito.
 * Cada vértice guarda `aDist`: distância desde o corpo do neurônio (cubo),
 * para o impulso se propagar pela árvore inteira no mesmo ritmo.
 */
export function taperedTube(
  curve: THREE.Curve<THREE.Vector3>,
  { r0, r1, startDist = 0, radial = 8 }: { r0: number; r1: number; startDist?: number; radial?: number },
): THREE.BufferGeometry {
  const length = curve.getLength();
  const segments = Math.max(6, Math.ceil(length * 18));
  const frames = curve.computeFrenetFrames(segments, false);
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const dist: number[] = [];
  const indices: number[] = [];
  const p = new THREE.Vector3();
  const n = new THREE.Vector3();

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    curve.getPointAt(t, p);
    const r = THREE.MathUtils.lerp(r0, r1, Math.pow(t, 0.8));
    const N = frames.normals[i];
    const B = frames.binormals[i];
    for (let j = 0; j <= radial; j++) {
      const v = (j / radial) * Math.PI * 2;
      const sin = Math.sin(v);
      const cos = -Math.cos(v);
      n.set(cos * N.x + sin * B.x, cos * N.y + sin * B.y, cos * N.z + sin * B.z).normalize();
      positions.push(p.x + r * n.x, p.y + r * n.y, p.z + r * n.z);
      normals.push(n.x, n.y, n.z);
      uvs.push(t, j / radial);
      dist.push(startDist + t * length);
    }
  }
  for (let i = 1; i <= segments; i++) {
    for (let j = 1; j <= radial; j++) {
      const a = (radial + 1) * (i - 1) + (j - 1);
      const b = (radial + 1) * i + (j - 1);
      const c = (radial + 1) * i + j;
      const d = (radial + 1) * (i - 1) + j;
      indices.push(a, b, d, b, c, d);
    }
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  g.setAttribute("aDist", new THREE.Float32BufferAttribute(dist, 1));
  g.setIndex(indices);
  return g;
}
