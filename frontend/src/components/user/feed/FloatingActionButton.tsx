"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const FloatingActionButton = ({
  onClick,
  className,
  children,
  ...props
}: {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-purple-500/20",
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
      <span className="absolute inset-0 rounded-full overflow-hidden">
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/40 to-blue-600/40 filter blur-xl transform scale-150 opacity-0 hover:opacity-100 transition-opacity"></span>
      </span>
    </motion.button>
  );
};

export default FloatingActionButton; 