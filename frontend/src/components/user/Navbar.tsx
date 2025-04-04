"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <nav className="bg-zinc-900 py-4 px-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
          Digital Gov Drishti
        </div>
        
        <ul className="flex items-center space-x-6">
          <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              My Feed
            </Link>
          </motion.li>
          
          <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/my-complaints" className="text-gray-300 hover:text-white transition-colors">
              My Complaints
            </Link>
          </motion.li>
          
          <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/hot-topic" className="text-gray-300 hover:text-white transition-colors">
              Hot Topic
            </Link>
          </motion.li>
          
          <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/appeal" className="text-gray-300 hover:text-white transition-colors">
              Appeal
            </Link>
          </motion.li>
          
          {/* <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              href="/auth/login" 
              className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition-all"
            >
              Login
            </Link>
          </motion.li> */}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;