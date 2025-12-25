
export enum EvolutionStage {
  CUB = 'CUB',
  TEEN = 'TEEN',
  YOUTH = 'YOUTH',
  WARRIOR = 'WARRIOR',
  LEGEND = 'LEGEND'
}

export interface UserStats {
  id: string;
  totalCheckins: number;
  todayCount: number;
  lastCheckinDate: string;
  history: Record<string, number>;
}

export interface GlobalState {
  totalGrass: number;
  dailyTotal: number;
  bossHP: number;
  lastUpdated: number;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  startTime: number;
  life: number;
}
