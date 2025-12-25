
import React from 'react';
import { EvolutionStage } from '../types';
import { STAGES, COLORS } from '../constants';

interface WarriorSpriteProps {
  stage: EvolutionStage;
  isFeeding: boolean;
  isEvolving: boolean;
}

const WarriorSprite: React.FC<WarriorSpriteProps> = ({ stage, isFeeding, isEvolving }) => {
  const config = STAGES[stage];
  
  // Re-creating the pixel cow from the image in SVG
  const renderWarriorSVG = () => {
    const size = config.size;
    const { warriorBody, warriorSnout, warriorHat, warriorHorns } = COLORS;

    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        className={`transition-all duration-300 ${isFeeding ? 'scale-110' : 'scale-100'}`}
        style={{
          filter: isFeeding ? `drop-shadow(0 0 15px ${COLORS.grass}) brightness(1.1)` : 'none',
          imageRendering: 'pixelated'
        }}
      >
        {/* Core Cow Structure - Inspired by the provided image */}
        
        {/* Body Base */}
        <rect x="12" y="32" width="40" height="24" fill={warriorBody} rx="12" />
        <rect x="18" y="22" width="28" height="20" fill={warriorBody} rx="8" />
        
        {/* Feet */}
        <rect x="16" y="54" width="8" height="4" fill={warriorHorns} />
        <rect x="40" y="54" width="8" height="4" fill={warriorHorns} />

        {/* Snout */}
        <rect x="22" y="34" width="20" height="10" fill={warriorSnout} rx="4" />
        <rect x="28" y="37" width="2" height="2" fill="#e879f9" opacity="0.6" />
        <rect x="34" y="37" width="2" height="2" fill="#e879f9" opacity="0.6" />

        {/* Eyes */}
        <rect x="22" y="28" width="6" height="6" fill="#000" rx="2" />
        <rect x="36" y="28" width="6" height="6" fill="#000" rx="2" />
        <rect x="23" y="29" width="2" height="2" fill="#fff" />
        <rect x="37" y="29" width="2" height="2" fill="#fff" />

        {/* Horns - Evolve with stage */}
        <g fill={warriorHorns}>
          {/* Left Horn */}
          <path d="M18 22 Q10 15 15 5" fill="none" stroke={warriorHorns} strokeWidth={stage === EvolutionStage.CUB ? "3" : "5"} />
          {/* Right Horn */}
          <path d="M46 22 Q54 15 49 5" fill="none" stroke={warriorHorns} strokeWidth={stage === EvolutionStage.CUB ? "3" : "5"} />
        </g>

        {/* Ears */}
        <rect x="10" y="26" width="8" height="6" fill={warriorBody} rx="2" />
        <rect x="46" y="26" width="8" height="6" fill={warriorBody} rx="2" />
        <rect x="12" y="28" width="4" height="2" fill="#fda4af" />
        <rect x="48" y="28" width="4" height="2" fill="#fda4af" />

        {/* Hat / Accessories - Stage Evolution */}
        {stage !== EvolutionStage.CUB && (
          <g>
            <rect x="24" y="14" width="16" height="8" fill={warriorHat} rx="4" />
            <rect x="30" y="10" width="4" height="4" fill={warriorHat} />
          </g>
        )}

        {/* Warrior Specifics */}
        {stage === EvolutionStage.WARRIOR && (
          <g>
             <rect x="4" y="35" width="4" height="20" fill="#cbd5e1" stroke="#475569" /> {/* Cape or sword? Let's give a sword */}
             <rect x="2" y="45" width="8" height="2" fill="#475569" />
          </g>
        )}

        {/* Legend Specifics */}
        {stage === EvolutionStage.LEGEND && (
          <g>
             {/* Glowing Aura */}
             <circle cx="32" cy="32" r="30" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeDasharray="5 5">
                <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="3s" repeatCount="indefinite" />
             </circle>
             {/* Royal Cape */}
             <path d="M12 32 L8 50 L56 50 L52 32 Z" fill="#9333ea" opacity="0.4" />
          </g>
        )}

        {/* Breath Animation - Subtle bounce */}
        <animateTransform 
          attributeName="transform" 
          type="translate" 
          values="0 0; 0 -2; 0 0" 
          dur="2s" 
          repeatCount="indefinite" 
        />
      </svg>
    );
  };

  return (
    <div className={`relative flex flex-col items-center justify-center transition-all duration-1000 ${isEvolving ? 'animate-bounce scale-125' : ''}`}>
      <div className="mb-4">
        {renderWarriorSVG()}
      </div>
      <div className="text-center relative z-10">
        <div className={`pixel-font text-lg px-6 py-2 inline-block pixel-border bg-[#000000aa] backdrop-blur-sm`} style={{ color: config.color }}>
          {config.label}
        </div>
        <p className="mt-2 text-sm text-shadow-pixel tracking-wider opacity-90">{config.description}</p>
      </div>
    </div>
  );
};

export default WarriorSprite;
