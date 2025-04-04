"use client";
import { useState } from 'react';

export default function UpskillPage() {
  const [selectedLevel, setSelectedLevel] = useState('');

  const handleUpskill = () => {
    console.log('Upskilling to:', selectedLevel);
    // In a real app, make an API call
  };

  return (
    <div>
      <h1>Upskill Complaint</h1>
      <label htmlFor="upskillLevel">Select Next Level:</label>
      <select id="upskillLevel" value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
        <option value="">-- Select --</option>
        <option value="inspector">Inspector</option>
        {/* Add more levels */}
      </select>
      <button onClick={handleUpskill} disabled={!selectedLevel}>Request Upskill</button>
    </div>
  );
}