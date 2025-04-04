"use client";
import React, { useState, useEffect } from 'react';

interface Complaint {
  id: number;
  title: string;
  status: string;
}

interface ComplaintRoadmapProps {
  complaintId: number;
  complaints: Complaint[];
}

const ComplaintRoadmap: React.FC<ComplaintRoadmapProps> = ({ complaintId, complaints }) => {
  const [currentStatus, setCurrentStatus] = useState<string | undefined>('');
  const roadmapStages = ['Submitted', 'Assigned', 'Under Review', 'Forwarded', 'Resolved', 'Rejected'];

  useEffect(() => {
    const selectedComplaint = complaints.find((c) => c.id === complaintId);
    setCurrentStatus(selectedComplaint?.status);
  }, [complaintId, complaints]);

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px' }}>
      <h3>Complaint ID: {complaintId}</h3>
      {currentStatus ? <p>Current Status: <strong>{currentStatus}</strong></p> : <p>Loading status...</p>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        {roadmapStages.map((stage) => (
          <div key={stage} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: currentStatus === stage ? 'green' : (roadmapStages.indexOf(stage) < roadmapStages.indexOf(currentStatus || '') ? 'lightgreen' : '#eee'),
                border: currentStatus === stage ? '2px solid darkgreen' : '1px solid #ccc',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontWeight: currentStatus === stage ? 'bold' : 'normal',
                color: currentStatus === stage ? 'white' : 'black',
                marginBottom: '5px',
              }}
            >
              {roadmapStages.indexOf(stage) + 1}
            </div>
            <small>{stage}</small>
            {roadmapStages.indexOf(stage) < roadmapStages.length - 1 && (
              <div style={{ flexGrow: 1, height: '2px', backgroundColor: roadmapStages.indexOf(stage) < roadmapStages.indexOf(currentStatus || '') ? 'lightgreen' : '#eee' }} />
            )}
          </div>
        ))}
      </div>
      {/* In a real app, you'd fetch and display more detailed status updates */}
    </div>
  );
};

export default ComplaintRoadmap;