import React from 'react';
import { motion } from 'framer-motion';

interface Complaint {
  id: number;
  title: string;
  status: string;
  date: string;
  description?: string;
}

interface ComplaintListProps {
  complaints: Complaint[];
  onComplaintSelect: (id: number) => void;
}

const ComplaintList: React.FC<ComplaintListProps> = ({ complaints, onComplaintSelect }) => {
  return (
    <div className="space-y-2">
      {complaints.map((complaint: Complaint, index: number) => (
        <motion.div
          key={complaint.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onComplaintSelect(complaint.id)}
          className="relative overflow-hidden group cursor-pointer bg-zinc-800 hover:bg-zinc-700 rounded-lg p-4 transition-all"
        >
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              <h3 className="font-medium text-white group-hover:text-purple-300 transition-colors">
                {complaint.title}
              </h3>
              <p className="text-xs text-gray-400 mt-1">{complaint.date}</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full ml-2 flex items-center justify-center ${
              complaint.status === 'Resolved' ? 'bg-green-900 text-green-200' :
              complaint.status === 'Submitted' ? 'bg-blue-900 text-blue-200' :
              complaint.status === 'Assigned' ? 'bg-yellow-900 text-yellow-200' :
              complaint.status === 'Review' ? 'bg-purple-900 text-purple-200' :
              'bg-purple-900 text-purple-200'
            }`}>
              {complaint.status}
            </span>
          </div>
          
          {/* Glowing border effect on hover */}
          <div className="absolute inset-0 border border-transparent group-hover:border-purple-500/30 rounded-lg transition-colors duration-300"></div>
          
          {/* Gradient on hover */}
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </motion.div>
      ))}
    </div>
  );
};

export default ComplaintList;