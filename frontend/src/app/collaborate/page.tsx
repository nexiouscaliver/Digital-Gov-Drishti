"use client";
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Import useParams and useRouter

export default function CollaboratePage() {
  const { crimeId } = useParams(); // Get the crimeId from the URL
  const router = useRouter(); // Initialize the router
  const [insight, setInsight] = useState('');

  const handleSubmit = () => {
    console.log(`Submitting insight for Crime ID ${crimeId}:`, insight);
    // In a real app, you'd make an API call to submit the insight
    // After successful submission, you might want to redirect the user or show a confirmation message
  };

  return (
    <div style={{
      backgroundColor: '#1E1E1E',
      padding: '20px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: '#F0F0F0',
    }}>
      <h1 style={{
        color: 'teal',
        textAlign: 'center',
        marginBottom: '20px',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
      }}>Collaborate on Crime ID: {crimeId}</h1>
      <div style={{
        width: '80%',
        maxWidth: '800px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        <p>Share your insights to help solve this case. Your contribution could be crucial!</p>
        <textarea
          value={insight}
          onChange={(e) => setInsight(e.target.value)}
          placeholder="Describe what you witnessed, any relevant details, or potential leads..."
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #555',
            backgroundColor: '#333',
            color: '#F0F0F0',
            marginBottom: '10px',
            minHeight: '150px',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={handleSubmit} style={actionButtonStyle} disabled={!insight.trim()}>Submit Insight</button>
          <button style={actionButtonStyle} onClick={() => router.back()}>Go Back</button> {/* Added Go Back button */}
        </div>
      </div>
    </div>
  );
}

const actionButtonStyle = {
  backgroundColor: 'teal',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  color: '#F0F0F0',
  transition: 'background-color 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: 'darkcyan',
  },
};