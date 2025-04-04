"use client";
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export const Sparkles = ({
  className,
  children,
  isActive = true,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
  isActive?: boolean;
}) => {
  const [sparkles, setSparkles] = useState<Array<{ id: string; createdAt: number; size: number; style: any }>>([]);
  const ref = useRef<HTMLDivElement>(null);

  const generateSparkle = (origin: { x: number; y: number }) => {
    const sparkleX = origin.x + Math.random() * 100 - 50;
    const sparkleY = origin.y + Math.random() * 100 - 50;
    const size = Math.floor(Math.random() * 10 + 5);
    
    return {
      id: String(Math.random()),
      createdAt: Date.now(),
      size,
      style: {
        top: sparkleY + "px",
        left: sparkleX + "px",
        zIndex: 2,
        width: size + "px",
        height: size + "px",
        transform: `rotate(${Math.floor(Math.random() * 360)}deg)`,
        background: `radial-gradient(${
          Math.random() > 0.5 ? "#FFC700" : "#FFC700"
        } 0%, transparent 70%)`,
        borderRadius: "50%",
      },
    };
  };

  useEffect(() => {
    if (isActive && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const origin = {
        x: Math.floor(Math.random() * rect.width),
        y: Math.floor(Math.random() * rect.height),
      };
      
      const newSparkle = generateSparkle(origin);
      setSparkles((sparkles) => [...sparkles, newSparkle]);
    }

    const timeoutId = setTimeout(() => {
      setSparkles((sparkles) => sparkles.filter((sparkle) => {
        const now = Date.now();
        return now - sparkle.createdAt < 1000;
      }));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [sparkles, isActive]);

  return (
    <div ref={ref} className={cn("relative w-fit", className)} {...props}>
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute animate-sparkle-ping pointer-events-none"
          style={sparkle.style}
        />
      ))}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default Sparkles; 