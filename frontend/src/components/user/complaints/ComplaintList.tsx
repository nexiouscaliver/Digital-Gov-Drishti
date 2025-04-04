import React from 'react';

interface Complaint {
  id: number;
  title: string;
  status: string;
}

interface ComplaintListProps {
  complaints: Complaint[];
  onComplaintSelect: (id: number) => void;
}

const ComplaintList: React.FC<ComplaintListProps> = ({ complaints, onComplaintSelect }) => {
  return (
    <ul>
      {complaints.map((complaint) => (
        <li
          key={complaint.id}
          onClick={() => onComplaintSelect(complaint.id)}
          style={{ cursor: 'pointer', padding: '8px', borderBottom: '1px solid #eee' }}
        >
          {complaint.title} - Status: {complaint.status}
        </li>
      ))}
    </ul>
  );
};

export default ComplaintList;