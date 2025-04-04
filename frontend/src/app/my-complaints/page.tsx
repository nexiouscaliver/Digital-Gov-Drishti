"use client";
import { useState } from 'react';
import ComplaintList from '@/components/user/complaints/ComplaintList';
import ComplaintRoadmap from '@/components/user/complaints/ComplaintRoadmap';
import NewComplaintForm from '@/components/user/complaints/NewComplaintForm';
import { motion } from 'framer-motion';

interface Complaint {
  id: number;
  title: string;
  status: string;
  date: string;
  description?: string;
}

export default function MyComplaintsPage() {
  const [selectedComplaintId, setSelectedComplaintId] = useState<number | null>(null);
  const [showNewComplaintForm, setShowNewComplaintForm] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([
    { id: 1, title: 'Noise complaint', status: 'Submitted', date: '2023-12-01', description: 'Loud construction noise during night hours' },
    { id: 2, title: 'Pothole on Main Road', status: 'Assigned', date: '2023-12-15', description: 'Large pothole near the intersection causing traffic hazards' },
    { id: 3, title: 'Streetlight not working', status: 'Resolved', date: '2024-01-10', description: 'Streetlight at 5th Avenue has been out for 2 weeks' },
    { id: 4, title: 'Garbage collection issue', status: 'Review', date: '2024-02-05', description: 'Garbage not collected for the past 3 days' },
  ]);

  const handleComplaintSelect = (id: number) => {
    setSelectedComplaintId(id);
  };

  const handleNewComplaintSubmit = (newComplaint: { title: string; description: string }) => {
    // In a real app, you'd make an API call to submit
    const newId = complaints.length + 1;
    const newComplaintWithDetails = { 
      id: newId, 
      ...newComplaint, 
      status: 'Submitted', 
      date: new Date().toISOString().split('T')[0]
    };
    
    setComplaints([...complaints, newComplaintWithDetails]);
    setShowNewComplaintForm(false);
    console.log('New complaint submitted:', newComplaint);
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
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
            My Complaints
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNewComplaintForm(!showNewComplaintForm)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-all"
          >
            {showNewComplaintForm ? 'Cancel' : '+ New Complaint'}
          </motion.button>
        </div>

        {showNewComplaintForm ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <NewComplaintForm onSubmit={handleNewComplaintSubmit} />
          </motion.div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-1 bg-zinc-900 rounded-xl p-6 shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-4 text-purple-400">Past Complaints</h2>
            <ComplaintList complaints={complaints} onComplaintSelect={handleComplaintSelect} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2 bg-zinc-900 rounded-xl p-6 shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-4 text-purple-400">Complaint Details</h2>
            {selectedComplaintId !== null ? (
              <div className="flex flex-col space-y-6">
                <div className="bg-zinc-800 rounded-lg p-4">
                  {(() => {
                    const complaint = complaints.find(c => c.id === selectedComplaintId);
                    return complaint ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-zinc-700 pb-3">
                          <h3 className="text-lg font-medium">Complaint #{complaint.id}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs flex items-center justify-center ${
                            complaint.status === 'Resolved' ? 'bg-green-900 text-green-200' :
                            complaint.status === 'Submitted' ? 'bg-blue-900 text-blue-200' :
                            complaint.status === 'Assigned' ? 'bg-yellow-900 text-yellow-200' :
                            complaint.status === 'Review' ? 'bg-purple-900 text-purple-200' :
                            'bg-purple-900 text-purple-200'
                          }`}>
                            {complaint.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-400">Title</p>
                            <p className="text-white">{complaint.title}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Date Filed</p>
                            <p className="text-white">{complaint.date}</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-400">Description</p>
                          <p className="text-white bg-zinc-700/30 p-3 rounded-md mt-1">{complaint.description || 'No description provided.'}</p>
                        </div>
                      </div>
                    ) : <p>Loading complaint information...</p>;
                  })()}
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-zinc-800 rounded-lg p-6"
                >
                  <h3 className="text-lg font-medium mb-6 border-b border-zinc-700 pb-2">Status Timeline</h3>
                  <div className="py-4">
                    <ComplaintRoadmap complaintId={selectedComplaintId} complaints={complaints} />
                  </div>
                </motion.div>
                
                {/* Action buttons */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="flex justify-end gap-3"
                >
                  <button className="px-4 py-2 bg-zinc-800 text-gray-300 rounded-lg hover:bg-zinc-700 transition-all">
                    Contact Official
                  </button>
                  <button className="px-4 py-2 bg-zinc-800 text-gray-300 rounded-lg hover:bg-zinc-700 transition-all">
                    Add Comment
                  </button>
                </motion.div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 bg-zinc-800 rounded-lg text-zinc-400">
                <p>Select a complaint from the list to view details.</p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}