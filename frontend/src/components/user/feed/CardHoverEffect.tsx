"use client";
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const CardHoverEffect = ({
  items,
  className,
  children,
}: {
  items?: any[];
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export const HoverCard = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPosition({ x, y });
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 group/card transition-colors hover:border-zinc-700",
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <div className="relative z-10">{children}</div>
      <motion.div
        className="absolute inset-0 z-0 bg-gradient-to-br from-purple-700 via-blue-700 to-transparent opacity-0 transition-opacity group-hover/card:opacity-100"
        style={{
          background: hovered
            ? `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(124, 58, 237, 0.15), transparent 40%)`
            : "",
        }}
      />
    </motion.div>
  );
};

export default CardHoverEffect; 