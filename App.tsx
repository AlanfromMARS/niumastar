
import React, { useState, useEffect, useCallback, useRef } from 'react';
import SpaceBackground from './components/SpaceBackground';
import WarriorSprite from './components/WarriorSprite';
import Heatmap from './components/Heatmap';
import StoryOverlay from './components/StoryOverlay';
import { EvolutionStage, GlobalState, UserStats, Particle } from './types';
import { getGlobalData, saveGlobalData, getUserStats, saveUserStats, generateUserID } from './services/storage';
import { COLORS, STAGES, BOSS_FIGHT_DATE, DAILY_LIMIT, BOSS_MAX_HP } from './constants';

const App: React.FC = () => {
  const [globalState, setGlobalState] = useState<GlobalState>({
    totalGrass: 0,
    dailyTotal: 0,
    bossHP: BOSS_MAX_HP,
    lastUpdated: Date.now()
  });
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isFeeding, setIsFeeding] = useState(false);
  const [isEvolving, setIsEvolving] = useState(false);
  const [showStory, setShowStory] = useState(() => {
    return !localStorage.getItem('niumaxing_story_seen');
  });
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [userId] = useState(() => generateUserID());
  
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playClickSound = () => {
    if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  };

  const getStage = (total: number): EvolutionStage => {
    if (total >= STAGES[EvolutionStage.LEGEND].min) return EvolutionStage.LEGEND;
    if (total >= STAGES[EvolutionStage.WARRIOR].min) return EvolutionStage.WARRIOR;
    if (total >= STAGES[EvolutionStage.YOUTH].min) return EvolutionStage.YOUTH;
    if (total >= STAGES[EvolutionStage.TEEN].min) return EvolutionStage.TEEN;
    return EvolutionStage.CUB;
  };

  useEffect(() => {
    const init = async () => {
      const gData = await getGlobalData();
      setGlobalState(gData);
      setUserStats(getUserStats(userId));
    };
    init();

    // Auto-save/sync interval
    const interval = setInterval(async () => {
      const gData = await getGlobalData();
      setGlobalState(gData);
    }, 5000);

    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const diff = BOSS_FIGHT_DATE - now;
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / 1000 / 60) % 60),
        secs: Math.floor((diff / 1000) % 60)
      });
    };
    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();
    return () => clearInterval(timer);
  }, []);

  const handleFeed = async () => {
    if (!userStats) return;
    if (userStats.todayCount >= DAILY_LIMIT) return;

    setIsFeeding(true);
    playClickSound();

    const isCrit = Math.random() < 0.05;
    const increment = isCrit ? 3 : 1;
    
    // Update local state first for responsiveness
    const newTotal = globalState.totalGrass + increment;
    const oldStage = getStage(globalState.totalGrass);
    const newStage = getStage(newTotal);

    if (newStage !== oldStage) {
      setIsEvolving(true);
      setTimeout(() => setIsEvolving(false), 3000);
    }

    const today = new Date().toISOString().split('T')[0];
    const updatedUserStats = {
      ...userStats,
      totalCheckins: userStats.totalCheckins + increment,
      todayCount: userStats.todayCount + 1,
      history: {
        ...userStats.history,
        [today]: (userStats.history[today] || 0) + increment
      }
    };

    const updatedGlobal = {
      ...globalState,
      totalGrass: newTotal,
      dailyTotal: globalState.dailyTotal + increment,
      lastUpdated: Date.now()
    };

    setGlobalState(updatedGlobal);
    setUserStats(updatedUserStats);
    saveGlobalData(updatedGlobal);
    saveUserStats(userId, updatedUserStats);

    // Particle effect
    const newParticles: Particle[] = [];
    for (let i = 0; i < (isCrit ? 15 : 6); i++) {
      newParticles.push({
        id: Math.random(),
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 50,
        y: window.innerHeight * 0.7,
        targetX: window.innerWidth / 2,
        targetY: window.innerHeight * 0.35,
        startTime: Date.now(),
        life: 1000
      });
    }
    setParticles(prev => [...prev, ...newParticles]);

    setTimeout(() => setIsFeeding(false), 300);
  };

  const closeStory = () => {
    setShowStory(false);
    localStorage.setItem('niumaxing_story_seen', 'true');
  };

  // Particle cleanup
  useEffect(() => {
    if (particles.length === 0) return;
    const cleanup = setInterval(() => {
      const now = Date.now();
      setParticles(prev => prev.filter(p => now - p.startTime < p.life));
    }, 100);
    return () => clearInterval(cleanup);
  }, [particles]);

  const currentStage = getStage(globalState.totalGrass);
  const nextStageKey = Object.values(EvolutionStage)[Object.values(EvolutionStage).indexOf(currentStage) + 1] as EvolutionStage;
  const nextStageMin = nextStageKey ? STAGES[nextStageKey].min : globalState.totalGrass;
  const progress = nextStageKey ? Math.min(100, (globalState.totalGrass / nextStageMin) * 100) : 100;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between text-white overflow-hidden p-4">
      <SpaceBackground />
      {showStory && <StoryOverlay onClose={closeStory} />}

      {/* Floating Particles */}
      {particles.map(p => {
        const elapsed = Date.now() - p.startTime;
        const ratio = elapsed / p.life;
        const x = p.x + (p.targetX - p.x) * ratio;
        const y = p.y + (p.targetY - p.y) * ratio - (Math.sin(ratio * Math.PI) * 100);
        return (
          <div
            key={p.id}
            className="fixed w-2 h-2 pointer-events-none z-40 bg-[#7ef04c] pixel-border"
            style={{ left: x, top: y, opacity: 1 - ratio }}
          />
        );
      })}

      {/* Top Header Stats */}
      <div className="w-full max-w-4xl flex justify-between items-start z-10">
        <div className="pixel-border bg-[#00000088] p-4 flex flex-col">
          <div className="flex items-center space-x-2 mb-2">
            <span className="pixel-font text-[10px] text-[#7ef04c]">全服草料总计</span>
            <button 
              onClick={() => setShowStory(true)}
              className="text-[10px] bg-[#0f3460] px-2 py-1 pixel-border hover:bg-[#1a1a2e] transition-colors"
            >
              📜 故事
            </button>
          </div>
          <span className="pixel-font text-2xl text-white text-shadow-pixel">{globalState.totalGrass.toLocaleString()}</span>
          <div className="w-full h-4 bg-[#16213e] pixel-border mt-2 relative overflow-hidden">
             <div className="h-full bg-[#7ef04c] transition-all duration-1000" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="text-[10px] mt-1 opacity-60">距离下一阶段: {progress.toFixed(1)}%</span>
        </div>

        <div className="pixel-border bg-[#00000088] p-4 text-right">
           <span className="pixel-font text-[10px] text-[#ff6b6b] mb-2">决战倒计时</span>
           <div className="flex space-x-2 justify-end">
              <div className="flex flex-col items-center">
                 <span className="pixel-font text-lg">{countdown.days}</span>
                 <span className="text-[8px]">DAYS</span>
              </div>
              <span className="pixel-font text-lg">:</span>
              <div className="flex flex-col items-center">
                 <span className="pixel-font text-lg">{countdown.hours.toString().padStart(2, '0')}</span>
                 <span className="text-[8px]">HRS</span>
              </div>
           </div>
        </div>
      </div>

      {/* Main Scene */}
      <div className="flex-1 flex flex-col items-center justify-center w-full z-10">
        <div className="relative">
          {/* Boss silhoutte in background */}
          <div 
            className="absolute -top-40 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none transition-all duration-1000"
            style={{ 
              transform: `translateX(-50%) scale(${0.5 + progress / 200})`,
              filter: 'blur(2px)'
            }}
          >
            <svg width="256" height="256" viewBox="0 0 64 64" fill="#9d4edd">
               <path d="M10 10 L54 10 L54 54 L10 54 Z" opacity="0.5"/>
               <rect x="20" y="20" width="24" height="24" />
               <rect x="24" y="24" width="4" height="4" fill="#ff0000" />
               <rect x="36" y="24" width="4" height="4" fill="#ff0000" />
            </svg>
          </div>

          <WarriorSprite 
            stage={currentStage} 
            isFeeding={isFeeding} 
            isEvolving={isEvolving}
          />
        </div>
      </div>

      {/* Controls Area */}
      <div className="w-full max-w-4xl space-y-4 z-10 mb-4">
        <div className="flex flex-col items-center">
          <button
            onClick={handleFeed}
            disabled={userStats ? userStats.todayCount >= DAILY_LIMIT : false}
            className={`
              pixel-font text-xl px-12 py-6 rounded-full pixel-border transition-all transform active:scale-95
              ${userStats && userStats.todayCount >= DAILY_LIMIT 
                ? 'bg-gray-700 cursor-not-allowed grayscale' 
                : 'bg-[#7ef04c] text-black hover:bg-[#99ff66] shadow-[0_0_20px_#7ef04c66] hover:shadow-[0_0_40px_#7ef04c99] animate-pulse'}
            `}
          >
            {userStats && userStats.todayCount >= DAILY_LIMIT ? '今日已达上限' : '喂草 FEED'}
          </button>
          <div className="mt-4 flex space-x-4 w-full justify-center">
             <div className="pixel-border bg-[#00000088] p-3 flex-1 text-center">
                <div className="text-[10px] opacity-60">我的贡献</div>
                <div className="pixel-font text-sm text-[#ffd60a]">{userStats?.totalCheckins || 0}</div>
             </div>
             <div className="pixel-border bg-[#00000088] p-3 flex-1 text-center">
                <div className="text-[10px] opacity-60">今日进度</div>
                <div className="pixel-font text-sm text-[#7ef04c]">{userStats?.todayCount || 0}/{DAILY_LIMIT}</div>
             </div>
             <div className="pixel-border bg-[#00000088] p-3 flex-1 text-center">
                <div className="text-[10px] opacity-60">全球排名</div>
                <div className="pixel-font text-sm">#99+</div>
             </div>
          </div>
        </div>

        {userStats && <Heatmap history={userStats.history} />}
      </div>

      {/* Evolution Banner */}
      {isEvolving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
           <div className="pixel-border bg-[#1a1a2e] p-8 text-center animate-bounce">
              <h2 className="pixel-font text-2xl text-[#ffd60a] mb-4">进化成功！</h2>
              <p className="text-xl">牛马战士进化为 [{STAGES[currentStage].label}] 阶段！</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
