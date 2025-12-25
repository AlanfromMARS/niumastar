
import { EvolutionStage } from './types';

export const COLORS = {
  spaceTop: '#1a1a2e',
  spaceBottom: '#16213e',
  grass: '#7ef04c',
  warriorBody: '#cbd5e1', // Light gray from image
  warriorSnout: '#fbcfe8', // Pink snout
  warriorHat: '#9333ea',   // Purple hat
  warriorHorns: '#1e293b', // Dark blue-black horns
  gold: '#ffd60a',
  uiBorder: '#0f3460',
  text: '#f0f0f0'
};

export const STAGES = {
  [EvolutionStage.CUB]: {
    min: 0,
    label: '牛马幼崽',
    size: 100,
    color: '#cbd5e1',
    description: '刚来到星际的可爱牛马'
  },
  [EvolutionStage.TEEN]: {
    min: 1000,
    label: '牛马少年',
    size: 130,
    color: '#a5b4fc',
    description: '戴上了心爱的紫色小帽'
  },
  [EvolutionStage.YOUTH]: {
    min: 5000,
    label: '热血青年',
    size: 160,
    color: '#fbcfe8',
    description: '角开始变得锋利了'
  },
  [EvolutionStage.WARRIOR]: {
    min: 15000,
    label: '星际勇士',
    size: 200,
    color: '#ff6b6b',
    description: '为了守护牛马星而战'
  },
  [EvolutionStage.LEGEND]: {
    min: 40000,
    label: '至尊传奇',
    size: 260,
    color: '#ffd60a',
    description: '牛马之神降临！'
  }
};

export const BOSS_FIGHT_DATE = new Date('2025-12-31T23:59:59').getTime();
export const DAILY_LIMIT = 100;
export const BOSS_MAX_HP = 50000;
