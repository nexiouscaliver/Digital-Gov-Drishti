"use client";
import CrimePost from '@/components/user/feed/CrimePost';
import ProofIndicator from '@/components/user/feed/ProofIndicator';
import { useState, useEffect } from 'react';

export default function MyFeedPage() {
  const [crimePosts, setCrimePosts] = useState([
    { id: 1, summary: 'Theft reported near the market. Seeking witnesses.', hasProof: true },
    { id: 2, summary: 'Issue with water supply in Sector 5.', hasProof: false },
    // Add more dummy data
  ]);

  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '20px', 
      minHeight: '100vh', // Ensure full height
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: 'black', // Added this line to set all text to black
    }}>
      <h1 style={{ 
        color: 'black', // Changed from darkblue to black
        textAlign: 'center', 
        marginBottom: '20px' 
      }}>My Feed</h1>
      <div style={{ 
        width: '80%', 
        maxWidth: '800px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px' 
      }}>
        {crimePosts.map((post) => (
          <div key={post.id} style={{ 
            border: '1px solid lightblue', 
            padding: '15px', 
            borderRadius: '8px', 
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            color: 'black', // Added to ensure text inside cards is black
          }}>
            <CrimePost summary={post.summary} />
            <ProofIndicator hasProof={post.hasProof} />
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-around' }}>
              <button style={{ backgroundColor: 'lightblue', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', color: 'black' }}>Like</button>
              <button style={{ backgroundColor: 'lightblue', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', color: 'black' }}>Dislike</button>
              <button style={{ backgroundColor: 'lightblue', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', color: 'black' }}>Share</button>
              <button style={{ backgroundColor: 'lightblue', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                <a href={`/collaborate/${post.id}`} style={{ color: 'black', textDecoration: 'none' }}>Collaborate</a>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}