import * as THREE from "three";
import { BRAND } from "../config/palette";
import { ICON_COUNT } from "./iconAtlas";

/*
 * Materiais dos cubos, todos para InstancedMesh (8 cubos = 1 draw call por camada).
 * Estado por instância:
 *  - aEnergy: intensidade da luz (idle ≈ 1, hover/seleção > 1, não selecionado < 1)
 *  - aFocus:  0..1, realce das bordas (hover, foco de teclado, seleção)
 */

/**
 * Cubo de LED opaco (referência: cubo leitoso aceso por dentro).
 * Miolo das faces mais claro, bordas azul saturado; as bordas arredondadas
 * acendem mais com aFocus.
 */
export function createLedCubeMaterial() {
  return new THREE.ShaderMaterial({
    toneMapped: false,
    uniforms: {
      uColor: { value: new THREE.Color("#1f5bff").multiplyScalar(1.8) },
      uHot: { value: new THREE.Color("#6fa8ff").multiplyScalar(3.2) },
      uEdge: { value: new THREE.Color("#8fb6ff").multiplyScalar(4) },
    },
    vertexShader: /* glsl */ `
      attribute float aEnergy;
      attribute float aFocus;
      varying vec3 vNormalW;
      varying vec3 vViewW;
      varying float vEnergy;
      varying float vFocus;
      void main() {
        vec4 world = modelMatrix * instanceMatrix * vec4(position, 1.0);
        vNormalW = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
        vViewW = normalize(cameraPosition - world.xyz);
        vEnergy = aEnergy;
        vFocus = aFocus;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform vec3 uHot;
      uniform vec3 uEdge;
      varying vec3 vNormalW;
      varying vec3 vViewW;
      varying float vEnergy;
      varying float vFocus;
      void main() {
        vec3 n = normalize(vNormalW);
        float facing = clamp(dot(n, normalize(vViewW)), 0.0, 1.0);
        float top = 0.5 + 0.5 * n.y;
        vec3 c = mix(uColor, uHot, pow(facing, 2.0) * 0.5);
        c *= (0.76 + 0.24 * top) * vEnergy;
        // bordas: só acendem com foco/seleção
        c += uEdge * pow(1.0 - facing, 3.0) * vFocus;
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
}

/** Halo: billboard instanciado com gradiente radial calculado no shader (sem textura). */
export function createHaloMaterial() {
  return new THREE.ShaderMaterial({
    toneMapped: false,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uColor: { value: new THREE.Color("#3a6bff") },
      uOpacity: { value: 0.5 },
    },
    vertexShader: /* glsl */ `
      attribute float aEnergy;
      varying vec2 vUv;
      varying float vEnergy;
      void main() {
        vec3 center = (modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
        float s = length(instanceMatrix[0].xyz);
        vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
        vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
        vec3 world = center + (right * position.x + up * position.y) * s;
        vUv = uv;
        vEnergy = aEnergy;
        gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec2 vUv;
      varying float vEnergy;
      void main() {
        float d = length(vUv - 0.5) * 2.0;
        float a = 1.0 - smoothstep(0.0, 1.0, d);
        a = a * a * uOpacity * vEnergy;
        gl_FragColor = vec4(uColor, a);
      }
    `,
  });
}

/** Ícone na face frontal do cubo: célula do atlas escolhida por instância (aCell). */
export function createIconMaterial(atlas: THREE.Texture) {
  return new THREE.ShaderMaterial({
    toneMapped: false,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uAtlas: { value: atlas },
      uCells: { value: ICON_COUNT },
      // Electric Blue sobre a face clara do cubo: maior contraste que o off-white
      uColor: { value: new THREE.Color(BRAND.blue).multiplyScalar(0.55) },
    },
    vertexShader: /* glsl */ `
      attribute float aCell;
      varying vec2 vUv;
      uniform float uCells;
      void main() {
        vUv = vec2((uv.x + aCell) / uCells, uv.y);
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uAtlas;
      uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        float a = texture2D(uAtlas, vUv).a;
        if (a < 0.02) discard;
        gl_FragColor = vec4(uColor, a);
        #include <colorspace_fragment>
      }
    `,
  });
}
