'use client';

import React from 'react';
import { cn } from '@/utils/cn';
import { EnvelopeStyleConfig } from '@/types';

interface EnvelopeFlapProps {
  isOpen: boolean;
  styleConfig: EnvelopeStyleConfig;
  className?: string;
  onClick?: () => void;
}

export const EnvelopeFlap: React.FC<EnvelopeFlapProps> = ({
  isOpen,
  styleConfig,
  className,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        transformOrigin: 'top center',
        perspective: '1400px',
      }}
      className={cn(
        'absolute top-0 left-0 right-0 z-30 transition-all duration-700 ease-in-out cursor-pointer',
        isOpen
          ? '-rotate-x-180 -translate-y-4 opacity-0 pointer-events-none'
          : 'rotate-x-0 opacity-100 pointer-events-auto',
        className
      )}
    >
      <div className="relative w-full">
        {/* Flap SVG matching Pinterest Reference (Straight vertical sides tapering into a sharp V-point) */}
        <svg
          viewBox="0 0 340 230"
          className="w-full drop-shadow-2xl overflow-visible select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Flap Shadow Filter */}
            <filter id="flap-shadow" x="-10%" y="0%" width="120%" height="130%">
              <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.4" />
            </filter>

            {/* Antique Wax Seal Gradient */}
            <radialGradient id="wax-gold" cx="35%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#FFF3B0" />
              <stop offset="25%" stopColor="#E5C158" />
              <stop offset="60%" stopColor="#C69214" />
              <stop offset="90%" stopColor="#8C5E09" />
              <stop offset="100%" stopColor="#543603" />
            </radialGradient>

            {/* Flap Paper Gradient */}
            <linearGradient id="flap-matte" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B1D32" />
              <stop offset="70%" stopColor="#751829" />
              <stop offset="100%" stopColor="#631422" />
            </linearGradient>
          </defs>

          {/* Main Envelope Flap Path: Straight sides from (0,0) down to y=120, then V-point to (170, 215) */}
          <path
            d="M 0 0 
               L 340 0 
               L 340 120 
               L 170 215 
               L 0 120 
               Z"
            fill={styleConfig.flapColor || 'url(#flap-matte)'}
            filter="url(#flap-shadow)"
          />

          {/* Subtle Matte Paper Texture Highlight along flap crease */}
          <path
            d="M 2 1 L 338 1"
            stroke="#FFFFFF"
            strokeOpacity="0.15"
            strokeWidth="1.5"
          />

          {/* Elegant V-Edge Highlight Line */}
          <path
            d="M 0 120 L 170 215 L 340 120"
            stroke="#000000"
            strokeOpacity="0.3"
            strokeWidth="1"
          />
          <path
            d="M 1 119 L 170 214 L 339 119"
            stroke="#FFFFFF"
            strokeOpacity="0.08"
            strokeWidth="1"
          />

          {/* Delicate Botanical Wheat / Dried Floral Sprig tucked behind the seal (Exactly like Pinterest ref!) */}
          {!isOpen && (
            <g transform="translate(170, 160)" className="pointer-events-none">
              {/* Main stems extending upward */}
              <path
                d="M 0 45 Q -2 -10 -4 -85 Q -6 -120 -8 -150"
                stroke="#D8BA7F"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.9"
              />
              <path
                d="M 0 45 Q 6 -5 12 -75 Q 16 -115 14 -145"
                stroke="#C5A465"
                strokeWidth="1.4"
                strokeLinecap="round"
                opacity="0.85"
              />
              <path
                d="M 0 45 Q -10 15 -18 -60 Q -24 -95 -20 -130"
                stroke="#E2C992"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.8"
              />

              {/* Side sprig branches & baby's breath florets */}
              <g fill="#ECD6A5" stroke="#B89452" strokeWidth="0.5">
                {/* Center Cluster */}
                <ellipse cx="-4" cy="-90" rx="4.5" ry="7" transform="rotate(-15 -4 -90)" />
                <ellipse cx="6" cy="-105" rx="4" ry="6.5" transform="rotate(18 6 -105)" />
                <ellipse cx="-1" cy="-125" rx="3.5" ry="5.5" transform="rotate(-5 -1 -125)" />
                <ellipse cx="-8" cy="-148" rx="3" ry="5" transform="rotate(-10 -8 -148)" />
                <ellipse cx="14" cy="-142" rx="3" ry="4.5" transform="rotate(22 14 -142)" />

                {/* Left Branch Florets */}
                <ellipse cx="-14" cy="-75" rx="3.5" ry="5" transform="rotate(-30 -14 -75)" />
                <ellipse cx="-22" cy="-98" rx="3" ry="5" transform="rotate(-25 -22 -98)" />
                <ellipse cx="-19" cy="-125" rx="2.5" ry="4" transform="rotate(-15 -19 -125)" />

                {/* Right Branch Florets */}
                <ellipse cx="15" cy="-70" rx="3.5" ry="5.5" transform="rotate(25 15 -70)" />
                <ellipse cx="20" cy="-92" rx="3" ry="4.5" transform="rotate(30 20 -92)" />
                <ellipse cx="18" cy="-115" rx="3" ry="5" transform="rotate(15 18 -115)" />

                {/* Micro Dried Seed Tufts */}
                <circle cx="-10" cy="-60" r="1.8" fill="#F4E3BA" />
                <circle cx="8" cy="-65" r="1.8" fill="#F4E3BA" />
                <circle cx="-16" cy="-110" r="1.5" fill="#FFF2D1" />
                <circle cx="10" cy="-130" r="1.6" fill="#FFF2D1" />
                <circle cx="-6" cy="-140" r="1.5" fill="#FFF2D1" />
                <circle cx="3" cy="-155" r="1.4" fill="#FFF2D1" />
              </g>

              {/* Lower Stem visible emerging below the seal */}
              <path
                d="M 1 45 L 3 80"
                stroke="#A88242"
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.8"
              />
            </g>
          )}

          {/* Antique Melted Gold Wax Seal Medallion (Directly at the V-point) */}
          {!isOpen && (
            <g transform="translate(170, 215)" className="cursor-pointer">
              {/* Soft wax drop shadow on envelope body */}
              <circle cx="0" cy="4" r="30" fill="#000000" opacity="0.45" filter="url(#flap-shadow)" />

              {/* Irregular Melted Wax Edge Rim (Liquid wax puddle look) */}
              <path
                d="M 0 -29
                   C 10 -30, 20 -26, 26 -18
                   C 31 -10, 32 -2, 30 8
                   C 28 17, 24 25, 16 29
                   C 7 32, -4 31, -14 28
                   C -23 25, -30 17, -31 8
                   C -32 -2, -29 -12, -24 -20
                   C -18 -26, -9 -29, 0 -29 Z"
                fill="url(#wax-gold)"
                stroke="#6B4405"
                strokeWidth="0.8"
              />

              {/* Raised Inner Rim Lip */}
              <circle
                cx="0"
                cy="0"
                r="23"
                fill="none"
                stroke="#855B09"
                strokeWidth="2.5"
                opacity="0.8"
              />
              <circle
                cx="-0.5"
                cy="-0.5"
                r="22"
                fill="none"
                stroke="#FFECA8"
                strokeWidth="1.2"
                opacity="0.9"
              />

              {/* Inner Wax Bed */}
              <circle cx="0" cy="0" r="20" fill="url(#wax-gold)" />

              {/* Deep Embossed Sacred Monogram (ॐ or Royal Calligraphy) */}
              <text
                x="0"
                y="6"
                textAnchor="middle"
                fontSize="22"
                fontFamily="serif"
                fontWeight="900"
                fill="#4D3002"
                style={{
                  filter: 'drop-shadow(0px 1px 0px rgba(255,248,220,0.7))',
                }}
              >
                ॐ
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
