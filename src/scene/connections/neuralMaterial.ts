import * as THREE from "three";

export interface NeuralOptions {
  color?: string;
  pulse?: string;
  /** intensidade HDR da cor base */
  strength?: number;
  /** maior distância da árvore: define o ciclo do impulso */
  reach?: number;
  speed?: number;
}

/**
 * Filamento neural: translúcido e somado à cena (aditivo), mais claro no eixo,
 * com granulado de membrana. O impulso nasce no corpo (aDist = 0) e se propaga
 * por todos os ramos ao mesmo tempo.
 */
export function createNeuralMaterial({
  color = "#3d6bff",
  pulse = "#b8ccff",
  strength = 2.2,
  reach = 30,
  speed = 4.2,
}: NeuralOptions = {}) {
  return new THREE.ShaderMaterial({
    toneMapped: false,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uActive: { value: 0 },
      uEmphasis: { value: 0.6 },
      /** 1 = impulso desce do corpo (execução) · -1 = sobe até o corpo (retorno do dado, FR-08) */
      uDirection: { value: 1 },
      uReach: { value: reach },
      uSpeed: { value: speed },
      uColor: { value: new THREE.Color(color).multiplyScalar(strength) },
      uPulse: { value: new THREE.Color(pulse).multiplyScalar(7) },
    },
    vertexShader: /* glsl */ `
      attribute float aDist;
      varying float vDist;
      varying vec3 vNormal;
      varying vec3 vView;
      varying vec3 vWorld;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vec4 mv = viewMatrix * world;
        vDist = aDist;
        vWorld = world.xyz;
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uActive;
      uniform float uEmphasis;
      uniform float uDirection;
      uniform float uReach;
      uniform float uSpeed;
      uniform vec3 uColor;
      uniform vec3 uPulse;
      varying float vDist;
      varying vec3 vNormal;
      varying vec3 vView;
      varying vec3 vWorld;

      float hash(vec3 p) {
        return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
      }

      void main() {
        // eixo do filamento mais claro que a borda (volume translúcido)
        float facing = abs(dot(normalize(vNormal), normalize(vView)));
        float core = pow(facing, 1.6);
        // granulado de membrana
        float grain = 0.72 + 0.5 * hash(floor(vWorld * 38.0));
        vec3 c = uColor * (0.25 + 0.75 * core) * grain * uEmphasis;

        // impulso: frente que sai do corpo e percorre a árvore (expoentes limitados: sem NaN)
        float head = mod(uTime * uSpeed, uReach + 6.0);
        float along = uDirection > 0.0 ? vDist : uReach - vDist;
        float d = head - along;
        float trail = step(0.0, d) * exp(-max(d, 0.0) / 1.8);
        float lead = (1.0 - step(0.0, d)) * exp(min(d, 0.0) * 10.0);
        c += uPulse * (trail + lead) * uActive * core;

        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
}
