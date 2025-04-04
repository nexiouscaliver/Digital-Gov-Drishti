"use client";
import TrendingComplaintCard from '@/components/user/hot-topic/TrendingcomplaintCard';
import { useState, useEffect } from 'react';

export default function HotTopicPage() {
  const [trendingComplaints, setTrendingComplaints] = useState([
    { id: 101, summary: 'Increased reports of chain snatching in the downtown area.', engagement: 'High', discussionCount: 150, imageUrl: '/chain-snatching.jpg' },
    { id: 102, summary: 'Water contamination concerns in Sector 12.', engagement: 'Very High', discussionCount: 220, imageUrl: '/water-contamination.jpg' },
    { id: 103, summary: 'Frequent power outages disrupting businesses.', engagement: 'Medium', discussionCount: 80, imageUrl: '/power-outage.jpg' },
    // Add more dummy trending topics
  ]);

  // In a real app, you would fetch this data from your backend:
  // useEffect(() => {
  //   fetch('/api/trending-complaints')
  //     .then(res => res.json())
  //     .then(data => setTrendingComplaints(data));
  // }, []);

  return (
    <div>
      <h1>Hot Topic</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {trendingComplaints.map((complaint) => (
          <TrendingComplaintCard key={complaint.id} {...complaint} />
        ))}
      </div>
    </div>
  );
}