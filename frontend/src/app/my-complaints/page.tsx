"use client";
import ComplaintList from '@/components/user/complaints/ComplaintList';
import ComplaintRoadmap from '@/components/user/complaints/ComplaintRoadmap';
import NewComplaintForm from '@/components/user/complaints/NewComplaintForm';
import { useState } from 'react';

export default function MyComplaintsPage() {
  const [selectedComplaintId, setSelectedComplaintId] = useState<number | null>(null);
  const [complaints, setComplaints] = useState([
    { id: 1, title: 'Noise complaint', status: 'Submitted' },
    { id: 2, title: 'Pothole on Main Road', status: 'Assigned' },
    { id: 3, title: 'Streetlight not working', status: 'Resolved' },
    // Add more dummy complaints
  ]);

  const handleComplaintSelect = (id: number) => {
    setSelectedComplaintId(id);
  };

  const handleNewComplaintSubmit = (newComplaint: { title: string; description: string }) => {
    // In a real app, you'd make an API call to submit
    const newId = complaints.length + 1;
    setComplaints([...complaints, { id: newId, ...newComplaint, status: 'Submitted' }]);
    console.log('New complaint submitted:', newComplaint);
    // Optionally clear the form
  };

  return (
    <div>
      <h1>My Complaints</h1>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, marginRight: '20px' }}>
          <h2>Past Complaints</h2>
          <ComplaintList complaints={complaints} onComplaintSelect={handleComplaintSelect} />
        </div>
        <div style={{ flex: 2 }}>
          <h2>Complaint Status</h2>
          {selectedComplaintId !== null ? (
            <ComplaintRoadmap complaintId={selectedComplaintId} complaints={complaints} />
          ) : (
            <p>Select a complaint from the list to view its status.</p>
          )}
        </div>
      </div>
      <h2>Add New Complaint</h2>
      <NewComplaintForm onSubmit={handleNewComplaintSubmit} />
    </div>
  );
}