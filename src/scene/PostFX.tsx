"use client";

import { Bloom, EffectComposer, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";

/**
 * O EffectComposer desliga o tone mapping do renderer; por isso ele fica sempre
 * montado e aplica o ACES no fim da cadeia (a exposição vem de gl.toneMappingExposure).
 *
 * Bloom seletivo por limiar: a cena renderiza em HDR linear e só os emissivos
 * (cubos, nós, cabo, linhas de luz) passam de 1.0. O resto não brilha.
 */
export function PostFX({ bloom, lite = false }: { bloom: number; lite?: boolean }) {
  // modo leve (GPU integrada): sem MSAA nem bloom; o tone mapping fica, senão a cena estoura
  return (
    <EffectComposer multisampling={lite ? 0 : 4}>
      {lite ? (
        <></>
      ) : (
        <Bloom
          mipmapBlur
          luminanceThreshold={1}
          luminanceSmoothing={0.2}
          intensity={bloom}
          radius={0.62}
        />
      )}
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
