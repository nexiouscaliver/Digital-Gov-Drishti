"use client";
import { useState } from 'react';
import { FaHeart, FaThumbsDown, FaShare, FaComments, FaFilter } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CardHoverEffect, HoverCard } from '@/components/user/feed/CardHoverEffect';
import ChatBotButton from '@/components/user/chatbot/ChatBotButton';

export default function MyFeedPage() {
  const [crimePosts, setCrimePosts] = useState([
    {
      id: 1,
      summary: 'Theft reported near the market. Seeking witnesses. Possible suspect identified.',
      hasProof: true,
      imageUrl: '/thetf.jpg',
      likes: 120,
      dislikes: 15,
      shares: 30,
      comments: 5,
      timestamp: '1 hour ago',
      location: 'Central Market',
      witnesses: 3,
      originalComplaintUrl: '/complaints/1',
      category: 'Crime',
    },
    {
      id: 2,
      summary: 'Issue with water supply in Sector 5. Urgent action needed. Low pressure reported.',
      hasProof: false,
      imageUrl: '/water.jpg',
      likes: 85,
      dislikes: 5,
      shares: 10,
      comments: 2,
      timestamp: '2 hours ago',
      location: 'Sector 5',
      witnesses: 0,
      originalComplaintUrl: '/complaints/2',
      category: 'Utilities',
    },
    {
      id: 3,
      summary: 'Road accident on Highway 42. Traffic disruption. Multiple vehicles involved.',
      hasProof: true,
      imageUrl: '/road.jpg',
      likes: 250,
      dislikes: 20,
      shares: 55,
      comments: 12,
      timestamp: '3 hours ago',
      location: 'Highway 42',
      witnesses: 5,
      originalComplaintUrl: '/complaints/3',
      category: 'Accident',
    },
    {
      id: 4,
      summary: 'Noise complaint in residential area. Late night disturbance. Loud music.',
      hasProof: false,
      imageUrl: '/noise.jpg',
      likes: 40,
      dislikes: 10,
      shares: 5,
      comments: 1,
      timestamp: '5 hours ago',
      location: 'Oakwood Apartments',
      witnesses: 1,
      originalComplaintUrl: '/complaints/4',
      category: 'Disturbance',
    },
    {
      id: 5,
      summary: 'Vandalism at the park. Damage to property. Graffiti reported.',
      hasProof: true,
      imageUrl: '/vandalism.jpg',
      likes: 180,
      dislikes: 18,
      shares: 40,
      comments: 8,
      timestamp: '8 hours ago',
      location: 'Central Park',
      witnesses: 2,
      originalComplaintUrl: '/complaints/5',
      category: 'Crime',
    },
    {
      id: 6,
      summary: 'Illegal dumping reported near the river. Environmental hazard. Chemical waste.',
      hasProof: false,
      imageUrl: '/dump.jpg',
      likes: 60,
      dislikes: 7,
      shares: 12,
      comments: 3,
      timestamp: '12 hours ago',
      location: 'Riverbank Area',
      witnesses: 0,
      originalComplaintUrl: '/complaints/6',
      category: 'Environment',
    },
    {
      id: 7,
      summary: 'Suspicious activity reported outside the bank. Possible robbery attempt.',
      hasProof: true,
      imageUrl: '/bank.jpg',
      likes: 110,
      dislikes: 10,
      shares: 25,
      comments: 7,
      timestamp: '1 day ago',
      location: 'First National Bank',
      witnesses: 4,
      originalComplaintUrl: '/complaints/7',
      category: 'Crime',
    },
    {
      id: 8,
      summary: 'Public gathering without permission. Violation of regulations.',
      hasProof: false,
      imageUrl: '/gathering.jpg',
      likes: 30,
      dislikes: 5,
      shares: 3,
      comments: 0,
      timestamp: '2 days ago',
      location: 'Town Square',
      witnesses: 0,
      originalComplaintUrl: '/complaints/8',
      category: 'Public Order',
    },
  ]);

  const router = useRouter();
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    hasProof: 'all',
    timeframe: 'all'
  });
  const [filteredPosts, setFilteredPosts] = useState(crimePosts);

  const handleLike = (id: number) => {
    setCrimePosts(prevPosts =>
      prevPosts.map(post =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
    setFilteredPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleDislike = (id: number) => {
    setCrimePosts(prevPosts =>
      prevPosts.map(post =>
        post.id === id ? { ...post, dislikes: post.dislikes + 1 } : post
      )
    );
    setFilteredPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === id ? { ...post, dislikes: post.dislikes + 1 } : post
      )
    );
  };

  const handleReportClick = () => {
    router.push('/user/login'); // Replace with your report page route
  };

  const applyFilters = () => {
    let filtered = [...crimePosts];
    
    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(post => 
        post.category.toLowerCase() === filters.category.toLowerCase()
      );
    }
    
    // Filter by proof status
    if (filters.hasProof !== 'all') {
      const hasProof = filters.hasProof === 'yes';
      filtered = filtered.filter(post => post.hasProof === hasProof);
    }
    
    // Filter by timeframe
    if (filters.timeframe !== 'all') {
      filtered = filtered.filter(post => {
        if (filters.timeframe === 'recent' && post.timestamp.includes('hour')) {
          return true;
        } else if (filters.timeframe === 'today' && 
          (post.timestamp.includes('hour') || post.timestamp === 'Today')) {
          return true;
        } else if (filters.timeframe === 'week' && 
          (!post.timestamp.includes('month') && !post.timestamp.includes('year'))) {
          return true;
        }
        return false;
      });
    }
    
    setFilteredPosts(filtered);
    setFilterOpen(false);
  };

  return (
    <div className="bg-zinc-950 text-white">
      {/* Hero Section */}
      <section className="relative py-24 text-center">
        <div className="container mx-auto">
          <h1 className={`text-4xl font-bold mb-4 ${heroAnimation ? 'opacity-100 transition-opacity duration-1000' : 'opacity-0'}`}>
            DRISHTI: Illuminate Corruption, Empower Transparency.
          </h1>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterOpen(!filterOpen)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-all cursor-pointer flex items-center"
          >
            <FaFilter className="mr-2" /> Filter Posts
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
                  <option value="utilities">Utilities</option>
                  <option value="accident">Accident</option>
                  <option value="disturbance">Disturbance</option>
                  <option value="environment">Environment</option>
                  <option value="public order">Public Order</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Proof Status</label>
                <select 
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-white"
                  value={filters.hasProof}
                  onChange={(e) => setFilters({...filters, hasProof: e.target.value})}
                >
                  <option value="all">All Posts</option>
                  <option value="yes">With Proof</option>
                  <option value="no">Without Proof</option>
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
                  <option value="recent">Last Few Hours</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
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
          {filteredPosts.map((post) => (
            <HoverCard key={post.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {post.imageUrl && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.imageUrl}
                      alt={post.summary}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="transition-transform duration-500 ease-in-out hover:scale-110"
                    />
                    <div className="absolute bottom-0 right-0 p-2">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        post.hasProof 
                          ? 'bg-green-900/80 text-green-200' 
                          : 'bg-red-900/80 text-red-200'
                      }`}>
                        {post.hasProof ? 'Proof Available' : 'No Proof'}
                      </span>
                    </div>
                    <div className="absolute top-0 left-0 p-2">
                      <span className="px-3 py-1 rounded-full text-xs bg-purple-900/80 text-purple-200">
                        {post.category}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="p-5">
                  <p className="text-lg font-medium mb-3 text-gray-100 line-clamp-2">{post.summary}</p>
                  
                  <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
                    <span>{post.timestamp}</span>
                    <span>{post.location}</span>
                    {post.witnesses > 0 && (
                      <span className="bg-zinc-800 px-2 py-1 rounded">
                        {post.witnesses} {post.witnesses === 1 ? 'Witness' : 'Witnesses'}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleLike(post.id)}
                      className={cn(
                        "flex flex-col items-center justify-center p-2 rounded transition-colors",
                        post.likes > 100 
                          ? "bg-green-900/30 text-green-400" 
                          : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                      )}
                    >
                      <FaHeart className="mb-1" />
                      <span className="text-xs">{post.likes}</span>
                    </motion.button>
                    
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDislike(post.id)}
                      className={cn(
                        "flex flex-col items-center justify-center p-2 rounded transition-colors",
                        post.dislikes > 10 
                          ? "bg-orange-900/30 text-orange-400" 
                          : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                      )}
                    >
                      <FaThumbsDown className="mb-1" />
                      <span className="text-xs">{post.dislikes}</span>
                    </motion.button>
                    
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center justify-center p-2 rounded bg-zinc-800 text-gray-300 hover:bg-zinc-700 transition-colors"
                    >
                      <FaShare className="mb-1" />
                      <span className="text-xs">{post.shares}</span>
                    </motion.button>
                    
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCollaborateClick(post.id)}
                      className="flex flex-col items-center justify-center p-2 rounded bg-purple-900/50 text-purple-300 hover:bg-purple-800/60 transition-colors"
                    >
                      <FaComments className="mb-1" />
                      <span className="text-xs">{post.comments}</span>
                    </motion.button>
                  </div>
                  
                  {post.originalComplaintUrl && (
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href={post.originalComplaintUrl}
                      className="mt-4 block w-full text-center bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-md text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
                    >
                      View Details
                    </motion.a>
                  )}
                </div>
              </motion.div>
            </HoverCard>
          ))}
        </CardHoverEffect>
      </motion.div>
      <ChatBotButton />
    </div>
  );
};

export default HomePage;