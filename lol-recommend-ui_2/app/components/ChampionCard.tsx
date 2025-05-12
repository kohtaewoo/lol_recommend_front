'use client';

import React, { useRef } from 'react';

type ChampionCardProps = {
  name: string;
  position?: string;
};

const ChampionCard: React.FC<ChampionCardProps> = ({ name, position = 'center' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    if (!container || !overlay) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const offsetX = x - centerX;
    const offsetY = y - centerY;

    const rotateY = offsetX / 30;
    const rotateX = -offsetY / 30;
    container.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    overlay.style.backgroundPosition = `${(x / rect.width) * 100}% ${(y / rect.height) * 100}%`;
    overlay.style.filter = `opacity(0.4) brightness(1.2) blur(2px)`;
  };

  const handleMouseLeave = () => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    if (!container || !overlay) return;

    container.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg)';
    overlay.style.filter = 'opacity(0)';
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="card-wrapper transition-transform duration-75 ease-linear"
    >
      {/* 반짝이 오버레이 */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: `radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0.25) 0%,
            rgba(255, 255, 255, 0.1) 30%,
            transparent 60%
          )`,
          mixBlendMode: 'soft-light',
          backgroundSize: '400% 400%',
          backgroundPosition: 'center',
          filter: 'opacity(0)',
          transition: 'filter 0.3s ease, background-position 0.3s ease',
        }}
      />

      {/* 챔피언 이미지 */}
      <div
        className="absolute inset-0 z-10 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${name}_0.jpg)`,
          backgroundPosition: position,
        }}
      />

      {/* 어두운 gradient 오버레이 */}
      <div className="absolute inset-0 z-15 bg-gradient-to-t from-black/0 to-transparent" />

      {/* 챔피언 이름 */}
      <div className="card-name">
        <span>{name}</span>
      </div>
    </div>
  );
};

export default ChampionCard;
