"use client";
import React, { useState } from 'react';

interface NewComplaintFormProps {
  onSubmit: (newComplaint: { title: string; description: string }) => void;
}

const NewComplaintForm: React.FC<NewComplaintFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onSubmit({ title, description });
      setTitle('');
      setDescription('');
    } else {
      alert('Please enter a title and description for your complaint.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd' }}>
      <div>
        <label htmlFor="complaintTitle" style={{ display: 'block', marginBottom: '5px' }}>Title:</label>
        <input
          type="text"
          id="complaintTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc' }}
          required
        />
      </div>
      <div>
        <label htmlFor="complaintDescription" style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
        <textarea
          id="complaintDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc' }}
          required
        />
      </div>
      <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
        Submit Complaint
      </button>
    </form>
  );
};

export default NewComplaintForm;