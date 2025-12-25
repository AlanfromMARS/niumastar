
import { GlobalState, UserStats } from '../types';

const USER_ID_KEY = 'niumaxing_user_id';

export const generateUserID = (): string => {
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
};

export const getGlobalData = async (): Promise<GlobalState> => {
  try {
    // Attempt to use window.storage if available
    const storage = (window as any).storage;
    if (storage && typeof storage.get === 'function') {
      const data = await storage.get('global:niumaxing_state', true);
      if (data) return data;
    }
  } catch (e) {
    console.error("Storage API error:", e);
  }

  // Fallback to localStorage (Simulating shared via local if needed, 
  // though real shared needs backend or standard window.storage)
  const local = localStorage.getItem('global:niumaxing_state');
  return local ? JSON.parse(local) : {
    totalGrass: 0,
    dailyTotal: 0,
    bossHP: 50000,
    lastUpdated: Date.now()
  };
};

export const saveGlobalData = async (data: GlobalState): Promise<void> => {
  try {
    const storage = (window as any).storage;
    if (storage && typeof storage.set === 'function') {
      await storage.set('global:niumaxing_state', data, true);
    }
  } catch (e) {
    console.error("Storage API error:", e);
  }
  localStorage.setItem('global:niumaxing_state', JSON.stringify(data));
};

export const getUserStats = (userId: string): UserStats => {
  const data = localStorage.getItem(`user:${userId}:stats`);
  const today = new Date().toISOString().split('T')[0];
  
  if (data) {
    const stats = JSON.parse(data) as UserStats;
    if (stats.lastCheckinDate !== today) {
      stats.todayCount = 0;
      stats.lastCheckinDate = today;
    }
    return stats;
  }

  return {
    id: userId,
    totalCheckins: 0,
    todayCount: 0,
    lastCheckinDate: today,
    history: {}
  };
};

export const saveUserStats = (userId: string, stats: UserStats): void => {
  localStorage.setItem(`user:${userId}:stats`, JSON.stringify(stats));
};
