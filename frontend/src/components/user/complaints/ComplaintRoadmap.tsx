"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Complaint {
  id: number;
  title: string;
  status: string;
  date?: string;
  description?: string;
}

interface ComplaintRoadmapProps {
  complaintId: number;
  complaints: Complaint[];
}

const ComplaintRoadmap: React.FC<ComplaintRoadmapProps> = ({ complaintId, complaints }) => {
  const [currentStatus, setCurrentStatus] = useState<string | undefined>('');
  const roadmapStages = ['Submitted', 'Assigned', 'Review', 'Forwarded', 'Resolved'];

  useEffect(() => {
    const selectedComplaint = complaints.find((c: Complaint) => c.id === complaintId);
    setCurrentStatus(selectedComplaint?.status);
  }, [complaintId, complaints]);

  // Find the current stage index
  const currentStageIndex = currentStatus ? roadmapStages.indexOf(currentStatus) : -1;

  return (
    <div className="relative pt-8 pb-2">
      {/* Background line */}
      <div className="absolute top-10 inset-x-0 h-0.5 bg-zinc-700"></div>
      
      {/* Progress line */}
      <motion.div 
        initial={{ width: 0 }}
        animate={{ 
          width: currentStageIndex >= 0 
            ? `${(currentStageIndex / (roadmapStages.length - 1)) * 100}%` 
            : '0%'
        }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="absolute top-10 left-0 h-0.5 bg-gradient-to-r from-green-500 to-purple-500 z-10"
      />

      {/* Status labels */}
      <div className="relative z-20 flex items-start justify-between">
        {roadmapStages.map((stage: string, index: number) => {
          // Determine if this stage is active, completed, or upcoming
          const isActive = stage === currentStatus;
          const isCompleted = currentStageIndex >= 0 && index <= currentStageIndex;
          
          return (
            <div key={stage} className="flex flex-col items-center">
              {/* Circle indicator at the top of the line */}
              <div className={`w-4 h-4 rounded-full mb-3 ${
                isActive ? 'bg-purple-500' :
                isCompleted ? 'bg-green-500' :
                'bg-zinc-600'
              }`} />
              
              {/* Label */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-sm text-center"
              >
                <div className={`font-medium ${
                  isActive ? 'text-purple-400' :
                  isCompleted ? 'text-green-400' :
                  'text-zinc-500'
                }`}>{stage}</div>
                
                {/* Status indicator text */}
                {(isActive || isCompleted) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-zinc-500 mt-1"
                  >
                    {isActive ? 'Current' : 
                     (isCompleted && index === 0) ? 'Filed' : 
                     isCompleted ? 'Completed' : ''}
                  </motion.div>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComplaintRoadmap;