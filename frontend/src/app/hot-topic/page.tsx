"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CardHoverEffect, HoverCard } from '@/components/user/feed/CardHoverEffect';
import { FaFire, FaFilter, FaArrowUp } from 'react-icons/fa';

export default function HotTopicPage() {
  const [trendingComplaints] = useState([
    { 
      id: 101, 
      summary: 'Increased reports of chain snatching in the downtown area.', 
      engagement: 'High', 
      discussionCount: 150, 
      imageUrl: '/chain-snatching.jpg',
      category: 'Crime',
      lastUpdated: '2 hours ago',
      participants: 78,
      voteCount: 245
    },
    { 
      id: 102, 
      summary: 'Water contamination concerns in Sector 12.', 
      engagement: 'Very High', 
      discussionCount: 220, 
      imageUrl: '/water-contamination.jpg',
      category: 'Environment',
      lastUpdated: '30 minutes ago',
      participants: 120,
      voteCount: 389
    },
    { 
      id: 103, 
      summary: 'Frequent power outages disrupting businesses.', 
      engagement: 'Medium', 
      discussionCount: 80, 
      imageUrl: '/power-outage.jpg',
      category: 'Infrastructure',
      lastUpdated: '5 hours ago',
      participants: 45,
      voteCount: 132
    },
    { 
      id: 104, 
      summary: 'Traffic signals malfunctioning at major intersection causing delays.', 
      engagement: 'Medium', 
      discussionCount: 92, 
      imageUrl: '/traffic.jpg',
      category: 'Transportation',
      lastUpdated: '1 day ago',
      participants: 56,
      voteCount: 178
    },
    { 
      id: 105, 
      summary: 'New garbage collection schedule causing confusion and missed pickups.', 
      engagement: 'High', 
      discussionCount: 183, 
      imageUrl: '/garbage.jpg',
      category: 'Public Services',
      lastUpdated: '4 hours ago',
      participants: 89,
      voteCount: 201
    },
    { 
      id: 106, 
      summary: 'Park renovation project delayed by three months.', 
      engagement: 'Medium', 
      discussionCount: 75, 
      imageUrl: '/park.jpg',
      category: 'Public Spaces',
      lastUpdated: '2 days ago',
      participants: 38,
      voteCount: 94
    },
  ]);

  const router = useRouter();
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    engagement: 'all',
    timeframe: 'all'
  });

  const applyFilters = () => {
    // In a real application, this would filter the actual data
    console.log("Applying filters:", filters);
    setFilterOpen(false);
  };

  const handleViewDetails = (id: number) => {
    // Navigate to details page
    router.push(`/hot-topic/${id}`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 flex items-center">
            <FaFire className="mr-3 text-orange-500" /> Hot Topics
          </h1>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterOpen(!filterOpen)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-all cursor-pointer flex items-center"
          >
            <FaFilter className="mr-2" /> Filter Topics
          </motion.div>
        </div>

        {filterOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 bg-zinc-900 p-6 rounded-xl shadow-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                <select 
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-white"
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                >
                  <option value="all">All Categories</option>
                  <option value="crime">Crime</option>
                  <option value="environment">Environment</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="transportation">Transportation</option>
                  <option value="public-services">Public Services</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Engagement Level</label>
                <select 
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-white"
                  value={filters.engagement}
                  onChange={(e) => setFilters({...filters, engagement: e.target.value})}
                >
                  <option value="all">All Levels</option>
                  <option value="very-high">Very High</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Time Frame</label>
                <select 
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-white"
                  value={filters.timeframe}
                  onChange={(e) => setFilters({...filters, timeframe: e.target.value})}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={applyFilters}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-md text-white font-medium"
              >
                Apply Filters
              </motion.button>
            </div>
          </motion.div>
        )}

        <CardHoverEffect>
          {trendingComplaints.map((topic) => (
            <HoverCard key={topic.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {topic.imageUrl && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={topic.imageUrl}
                      alt={topic.summary}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="transition-transform duration-500 ease-in-out hover:scale-110"
                    />
                    <div className="absolute top-0 left-0 p-2">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        topic.engagement === 'Very High' 
                          ? 'bg-red-900/80 text-red-200' 
                          : topic.engagement === 'High'
                          ? 'bg-orange-900/80 text-orange-200'
                          : 'bg-blue-900/80 text-blue-200'
                      }`}>
                        {topic.engagement} Engagement
                      </span>
                    </div>
                    <div className="absolute top-0 right-0 p-2">
                      <span className="px-3 py-1 rounded-full text-xs bg-purple-900/80 text-purple-200">
                        {topic.category}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="p-5">
                  <p className="text-lg font-medium mb-3 text-gray-100 line-clamp-2">{topic.summary}</p>
                  
                  <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
                    <span>Updated {topic.lastUpdated}</span>
                    <span>{topic.participants} Participants</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="flex flex-col items-center justify-center p-3 rounded bg-zinc-800 text-gray-300">
                      <span className="text-2xl font-semibold text-purple-400">{topic.discussionCount}</span>
                      <span className="text-xs mt-1">Discussions</span>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center p-3 rounded bg-zinc-800 text-gray-300">
                      <span className="text-2xl font-semibold text-green-400 flex items-center">
                        {topic.voteCount} <FaArrowUp className="ml-1 text-sm" />
                      </span>
                      <span className="text-xs mt-1">Votes</span>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleViewDetails(topic.id)}
                    className="mt-4 block w-full text-center bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-md text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
                  >
                    Join Discussion
                  </motion.button>
                </div>
              </motion.div>
            </HoverCard>
          ))}
        </CardHoverEffect>
      </motion.div>
    </div>
  );
}