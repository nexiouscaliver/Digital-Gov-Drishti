"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AppealPage() {
  const [selectedLevel, setSelectedLevel] = useState('');
  const [appealReason, setAppealReason] = useState('');

  const handleAppeal = () => {
    console.log('Appealing to:', selectedLevel, 'Reason:', appealReason);
    // In a real app, make an API call
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 mb-8">
          Appeal Complaint
        </h1>

        <div className="bg-zinc-900 rounded-xl p-6 shadow-xl">
          <div className="mb-4">
            <label htmlFor="appealLevel" className="block text-sm font-medium text-gray-400 mb-2">
              Select Appeal Authority:
            </label>
            <select 
              id="appealLevel" 
              value={selectedLevel} 
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">-- Select Authority --</option>
              <option value="inspector">District Inspector</option>
              <option value="commissioner">Police Commissioner</option>
              <option value="court">Local Court</option>
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="appealReason" className="block text-sm font-medium text-gray-400 mb-2">
              Reason for Appeal:
            </label>
            <textarea
              id="appealReason"
              value={appealReason}
              onChange={(e) => setAppealReason(e.target.value)}
              rows={4}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Explain why you are appealing this complaint..."
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAppeal} 
            disabled={!selectedLevel || !appealReason}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Appeal
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}