
import React from 'react';

interface StoryOverlayProps {
  onClose: () => void;
}

const StoryOverlay: React.FC<StoryOverlayProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-500">
      <div className="max-w-2xl w-full pixel-border bg-[#1a1a2e] p-6 md:p-10 relative overflow-hidden">
        {/* Decorative corner accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#ffd60a]"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#ffd60a]"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#ffd60a]"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#ffd60a]"></div>

        <h2 className="pixel-font text-xl md:text-2xl text-[#ff6b6b] mb-6 text-center text-shadow-pixel animate-pulse">
          - 英雄传说：牛马星保卫战 -
        </h2>

        <div className="space-y-6 text-base md:text-lg leading-relaxed text-[#cbd5e1] font-medium tracking-wide">
          <p className="animate-in slide-in-from-bottom-2 duration-700 delay-100">
            <span className="text-[#9d4edd] font-bold">BOSS 星领主</span> 率领恐怖的机械军团突然入侵，原本宁静祥和的牛马星瞬间危在旦夕！
          </p>
          
          <p className="animate-in slide-in-from-bottom-2 duration-700 delay-300">
            古老的星际预言流传至今：当黑暗笼罩大地，唯有所有牛马星人 <span className="text-[#7ef04c]">团结一致、共同打卡喂草</span>，才能唤醒沉睡在星核中的最强 <span className="text-[#ffd60a]">牛马战士</span>。
          </p>
          
          <p className="animate-in slide-in-from-bottom-2 duration-700 delay-500 border-l-4 border-[#7ef04c] pl-4 italic">
            “每一次投喂，都是在为战士注入星辰伟力；每一次成长，都是我们的文明向胜利迈出的一大步。”
          </p>
          
          <p className="animate-in slide-in-from-bottom-2 duration-700 delay-700 text-center text-white pt-4">
            年底决战的钟声即将敲响！勇敢的牛马星人们，请献出你们的指尖聚力，喂养出最强战士，一同反攻 BOSS 星，<span className="text-[#ff6b6b] font-bold">守护我们的家园！</span>
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <button 
            onClick={onClose}
            className="pixel-font bg-[#7ef04c] text-black px-8 py-3 hover:bg-[#99ff66] active:scale-95 transition-all pixel-border shadow-[0_0_15px_#7ef04c44]"
          >
            接受使命 START
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryOverlay;
