"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Complaint {
  id: number;
  title: string;
  status: string;
  date: string;
  description?: string;
}

export default function AppealPage() {
  const [selectedComplaintId, setSelectedComplaintId] = useState<number | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedAuthority, setSelectedAuthority] = useState('');
  const [appealReason, setAppealReason] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch complaints data
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, using mock data
    setComplaints([
      { id: 1, title: 'Noise complaint', status: 'Submitted', date: '2023-12-01', description: 'Loud construction noise during night hours' },
      { id: 2, title: 'Pothole on Main Road', status: 'Assigned', date: '2023-12-15', description: 'Large pothole near the intersection causing traffic hazards' },
      { id: 3, title: 'Streetlight not working', status: 'Resolved', date: '2024-01-10', description: 'Streetlight at 5th Avenue has been out for 2 weeks' },
      { id: 4, title: 'Garbage collection issue', status: 'Review', date: '2024-02-05', description: 'Garbage not collected for the past 3 days' },
    ]);
    setLoading(false);
  }, []);

  const handleComplaintSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    setSelectedComplaintId(id || null);
  };

  const handleAppeal = () => {
    if (!selectedComplaintId || !selectedAuthority || !appealReason) {
      return;
    }
    
    const selectedComplaint = complaints.find(c => c.id === selectedComplaintId);
    
    console.log('Appeal submitted:', {
      complaintId: selectedComplaintId,
      complaintTitle: selectedComplaint?.title,
      appealingTo: selectedAuthority,
      reason: appealReason
    });
    
    // In a real app, this would be an API call to submit the appeal
    alert('Appeal submitted successfully!');
    
    // Reset form
    setSelectedComplaintId(null);
    setSelectedAuthority('');
    setAppealReason('');
  };

  // Indian Government Ministries and Departments for dropdown
  const governmentBodies = [
    // Ministries
    { value: "ministry-agriculture", label: "Ministry of Agriculture and Farmers Welfare" },
    { value: "ministry-ayush", label: "Ministry of AYUSH" },
    { value: "ministry-chemical", label: "Ministry of Chemical and Fertilizers" },
    { value: "ministry-civil-aviation", label: "Ministry of Civil Aviation" },
    { value: "ministry-coal", label: "Ministry of Coal" },
    { value: "ministry-commerce", label: "Ministry of Commerce and Industry" },
    { value: "ministry-consumer", label: "Ministry of Consumer Affairs, Food and Public Distribution" },
    { value: "ministry-communication", label: "Ministry of Communications" },
    { value: "ministry-corporate", label: "Ministry of Corporate Affairs" },
    { value: "ministry-culture", label: "Ministry of Culture" },
    { value: "ministry-defence", label: "Ministry of Defence" },
    { value: "ministry-doner", label: "Ministry of Development of North Eastern Region" },
    { value: "ministry-earth", label: "Ministry of Earth Sciences" },
    { value: "ministry-electronics", label: "Ministry of Electronics and Information Technology" },
    { value: "ministry-environment", label: "Ministry of Environment, Forest and Climate Change" },
    { value: "ministry-external", label: "Ministry of External Affairs" },
    { value: "ministry-finance", label: "Ministry of Finance" },
    { value: "ministry-fisheries", label: "Ministry of Fisheries, Animal Husbandry and Dairying" },
    { value: "ministry-food", label: "Ministry of Food Processing Industries" },
    { value: "ministry-health", label: "Ministry of Health & Family Welfare" },
    { value: "ministry-heavy", label: "Ministry of Heavy Industries" },
    { value: "ministry-home", label: "Ministry of Home Affairs" },
    { value: "ministry-housing", label: "Ministry of Housing and Urban Affairs" },
    { value: "ministry-education", label: "Ministry of Education" },
    { value: "ministry-information", label: "Ministry of Information and Broadcasting" },
    { value: "ministry-jal-shakti", label: "Ministry of Jal Shakti" },
    { value: "ministry-labour", label: "Ministry of Labour & Employment" },
    { value: "ministry-law", label: "Ministry of Law and Justice" },
    { value: "ministry-msme", label: "Ministry of Micro, Small and Medium Enterprises" },
    { value: "ministry-mines", label: "Ministry of Mines" },
    { value: "ministry-minority", label: "Ministry of Minority Affairs" },
    { value: "ministry-renewable", label: "Ministry of New and Renewable Energy" },
    { value: "ministry-panchayati", label: "Ministry of Panchayati Raj" },
    { value: "ministry-parliamentary", label: "Ministry of Parliamentary Affairs" },
    { value: "ministry-personnel", label: "Ministry of Personnel, Public Grievances and Pension" },
    { value: "ministry-petroleum", label: "Ministry of Petroleum and Natural Gas" },
    { value: "ministry-power", label: "Ministry of Power" },
    { value: "ministry-railways", label: "Ministry of Railways" },
    { value: "ministry-road", label: "Ministry of Road Transport and Highways" },
    { value: "ministry-rural", label: "Ministry of Rural Development" },
    { value: "ministry-science", label: "Ministry of Science and Technology" },
    { value: "ministry-shipping", label: "Ministry of Shipping" },
    { value: "ministry-skill", label: "Ministry of Skill Development and Entrepreneurship" },
    { value: "ministry-social", label: "Ministry of Social Justice and Empowerment" },
    { value: "ministry-statistics", label: "Ministry of Statistics and Programme Implementation" },
    { value: "ministry-steel", label: "Ministry of Steel" },
    { value: "ministry-textiles", label: "Ministry of Textiles" },
    { value: "ministry-tourism", label: "Ministry of Tourism" },
    { value: "ministry-tribal", label: "Ministry of Tribal Affairs" },
    { value: "ministry-women", label: "Ministry of Women and Child Development" },
    { value: "ministry-youth", label: "Ministry of Youth Affairs and Sports" },
    
    // Key Departments
    { value: "dept-atomic", label: "Department of Atomic Energy" },
    { value: "dept-space", label: "Department of Space" },
    { value: "dept-telecom", label: "Department of Telecommunications" },
    { value: "dept-posts", label: "Department of Posts" },
    { value: "dept-revenue", label: "Department of Revenue" },
    { value: "dept-financial", label: "Department of Financial Services" },
    { value: "dept-agriculture", label: "Department of Agriculture and Co-operation" },
    { value: "dept-consumer", label: "Department of Consumer Affairs" },
    { value: "dept-food", label: "Department of Food and Public Distribution" },
    { value: "dept-darpg", label: "Department of Administrative Reforms and Public Grievances" },

    // State Level Authorities
    { value: "state-chief-secretary", label: "State Chief Secretary" },
    { value: "district-collector", label: "District Collector/Magistrate" },
    { value: "municipal-commissioner", label: "Municipal Commissioner" },
    { value: "police-commissioner", label: "Police Commissioner" },
    { value: "local-court", label: "Local Court" },
  ];

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
          {loading ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading complaints...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <label htmlFor="complaintSelect" className="block text-sm font-medium text-gray-400 mb-2">
                  Select Complaint to Appeal:
                </label>
                <select 
                  id="complaintSelect" 
                  value={selectedComplaintId || ''}
                  onChange={handleComplaintSelect}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">-- Select a Complaint --</option>
                  {complaints.map(complaint => (
                    <option key={complaint.id} value={complaint.id}>
                      {complaint.title} - {complaint.status} ({complaint.date})
                    </option>
                  ))}
                </select>
              </div>

              {selectedComplaintId && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6 p-4 bg-zinc-800 rounded-lg"
                >
                  {(() => {
                    const complaint = complaints.find(c => c.id === selectedComplaintId);
                    return complaint ? (
                      <div>
                        <div className="flex justify-between items-center border-b border-zinc-700 pb-3 mb-3">
                          <h3 className="text-lg font-medium">Complaint #{complaint.id}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            complaint.status === 'Resolved' ? 'bg-green-900 text-green-200' :
                            complaint.status === 'Submitted' ? 'bg-blue-900 text-blue-200' :
                            complaint.status === 'Assigned' ? 'bg-yellow-900 text-yellow-200' :
                            complaint.status === 'Review' ? 'bg-purple-900 text-purple-200' :
                            'bg-purple-900 text-purple-200'
                          }`}>
                            {complaint.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">Description:</p>
                        <p className="text-white">{complaint.description}</p>
                      </div>
                    ) : null;
                  })()}
                </motion.div>
              )}

              <div className="mb-6">
                <label htmlFor="appealLevel" className="block text-sm font-medium text-gray-400 mb-2">
                  Select Appeal Authority:
                </label>
                <select 
                  id="appealLevel" 
                  value={selectedAuthority} 
                  onChange={(e) => setSelectedAuthority(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">-- Select Authority --</option>
                  <optgroup label="Ministries">
                    {governmentBodies
                      .filter(body => body.value.startsWith('ministry-'))
                      .map(body => (
                        <option key={body.value} value={body.value}>
                          {body.label}
                        </option>
                      ))
                    }
                  </optgroup>
                  <optgroup label="Departments">
                    {governmentBodies
                      .filter(body => body.value.startsWith('dept-'))
                      .map(body => (
                        <option key={body.value} value={body.value}>
                          {body.label}
                        </option>
                      ))
                    }
                  </optgroup>
                  <optgroup label="Local Authorities">
                    {governmentBodies
                      .filter(body => !body.value.startsWith('ministry-') && !body.value.startsWith('dept-'))
                      .map(body => (
                        <option key={body.value} value={body.value}>
                          {body.label}
                        </option>
                      ))
                    }
                  </optgroup>
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

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAppeal} 
                  disabled={!selectedComplaintId || !selectedAuthority || !appealReason}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Appeal
                </motion.button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}