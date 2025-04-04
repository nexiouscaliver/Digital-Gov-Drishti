"use client";
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';

interface NewComplaintFormProps {
  onSubmit: (newComplaint: { title: string; description: string }) => void;
}

const NewComplaintForm: React.FC<NewComplaintFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onSubmit({ 
        title: `${category.charAt(0).toUpperCase() + category.slice(1)}: ${title}`, 
        description: `Location: ${location || 'Not specified'}\n\n${description}` 
      });
      setTitle('');
      setDescription('');
      setCategory('general');
      setLocation('');
    } else {
      alert('Please enter a title and description for your complaint.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-zinc-900 rounded-xl shadow-xl p-6 border border-purple-500/20"
    >
      <h2 className="text-xl font-semibold mb-6 text-purple-400">New Complaint</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="complaintCategory" className="block text-sm font-medium text-gray-300">
              Category
            </label>
            <select
              id="complaintCategory"
              value={category}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            >
              <option value="general">General</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="utilities">Utilities</option>
              <option value="public services">Public Services</option>
              <option value="safety">Safety & Security</option>
              <option value="environment">Environment</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="complaintLocation" className="block text-sm font-medium text-gray-300">
              Location (optional)
            </label>
            <input
              type="text"
              id="complaintLocation"
              value={location}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
              placeholder="Street address or landmark"
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="complaintTitle" className="block text-sm font-medium text-gray-300">
            Title
          </label>
          <input
            type="text"
            id="complaintTitle"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            placeholder="Brief title of your complaint"
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="complaintDescription" className="block text-sm font-medium text-gray-300">
            Description
          </label>
          <textarea
            id="complaintDescription"
            value={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            rows={5}
            placeholder="Detailed description of the issue"
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
            required
          />
        </div>

        <div className="flex justify-end">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg shadow-lg hover:shadow-purple-500/20 transition-all"
          >
            Submit Complaint
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default NewComplaintForm;