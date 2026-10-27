import type { FloorKey } from "@/content/types";
import { CUBE_SIZE, LEVELS, TERMINAL_HEIGHT, type Department } from "./config/constants";
import { BOARD } from "./floors/DepartmentBoards";
import { podTarget } from "./floors/departmentPods";
import { shift } from "./props/furniture";

/**
 * Onde o rótulo de uma área fica, por andar (FR-03: a mesma área reconhecível
 * em todos os andares). Rooftop: sobre o cubo. Brain: sobre o quadro de indicadores.
 * Heart: sobre o posto da equipe. Backbone: sobre o terminal.
 */
export function labelAnchor(d: Department, floor: FloorKey | null): [number, number, number] {
  if (floor === "brain") {
    const p = shift(d.zone, 0, BOARD.z);
    return [p.x, LEVELS.brain + BOARD.bottom + BOARD.height + 0.35, p.z];
  }
  if (floor === "heart") {
    const p = shift(d.zone, 0, podTarget(d).z);
    return [p.x, LEVELS.heart + 2.25, p.z];
  }
  if (floor === "backbone") {
    return [d.anchor.x, LEVELS.backbone + TERMINAL_HEIGHT + 0.5, d.anchor.z];
  }
  return [d.cube.x, d.cube.y + CUBE_SIZE / 2 + 0.55, d.cube.z];
}
