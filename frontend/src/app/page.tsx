"use client";
import CrimePost from '@/components/user/feed/CrimePost';
import ProofIndicator from '@/components/user/feed/ProofIndicator';
import { useState } from 'react';
import { FaHeart, FaThumbsDown, FaShare, FaComments } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function MyFeedPage() {
  const [crimePosts, setCrimePosts] = useState([
    {
      id: 1,
      summary: 'Theft reported near the market. Seeking witnesses. Possible suspect identified.',
      hasProof: true,
      imageUrl: '/thetf.jpg',
      likes: 120,
      dislikes: 15,
      shares: 30,
      comments: 5,
      timestamp: '1 hour ago',
      location: 'Central Market',
      witnesses: 3,
      originalComplaintUrl: '/complaints/1', // Dummy URL
    },
    {
      id: 2,
      summary: 'Issue with water supply in Sector 5. Urgent action needed. Low pressure reported.',
      hasProof: false,
      imageUrl: '/water.jpg',
      likes: 85,
      dislikes: 5,
      shares: 10,
      comments: 2,
      timestamp: '2 hours ago',
      location: 'Sector 5',
      witnesses: 0,
      originalComplaintUrl: '/complaints/2', // Dummy URL
    },
    {
      id: 3,
      summary: 'Road accident on Highway 42. Traffic disruption. Multiple vehicles involved.',
      hasProof: true,
      imageUrl: '/road.jpg',
      likes: 250,
      dislikes: 20,
      shares: 55,
      comments: 12,
      timestamp: '3 hours ago',
      location: 'Highway 42',
      witnesses: 5,
      originalComplaintUrl: '/complaints/3', // Dummy URL
    },
    {
      id: 4,
      summary: 'Noise complaint in residential area. Late night disturbance. Loud music.',
      hasProof: false,
      imageUrl: '/noise.jpg',
      likes: 40,
      dislikes: 10,
      shares: 5,
      comments: 1,
      timestamp: '5 hours ago',
      location: 'Oakwood Apartments',
      witnesses: 1,
      originalComplaintUrl: '/complaints/4', // Dummy URL
    },
    {
      id: 5,
      summary: 'Vandalism at the park. Damage to property. Graffiti reported.',
      hasProof: true,
      imageUrl: '/vandalism.jpg',
      likes: 180,
      dislikes: 18,
      shares: 40,
      comments: 8,
      timestamp: '8 hours ago',
      location: 'Central Park',
      witnesses: 2,
      originalComplaintUrl: '/complaints/5', // Dummy URL
    },
    {
      id: 6,
      summary: 'Illegal dumping reported near the river. Environmental hazard. Chemical waste.',
      hasProof: false,
      imageUrl: '/dump.jpg',
      likes: 60,
      dislikes: 7,
      shares: 12,
      comments: 3,
      timestamp: '12 hours ago',
      location: 'Riverbank Area',
      witnesses: 0,
      originalComplaintUrl: '/complaints/6', // Dummy URL
    },
    {
      id: 7,
      summary: 'Suspicious activity reported outside the bank. Possible robbery attempt.',
      hasProof: true,
      imageUrl: '/bank.jpg',
      likes: 110,
      dislikes: 10,
      shares: 25,
      comments: 7,
      timestamp: '1 day ago',
      location: 'First National Bank',
      witnesses: 4,
      originalComplaintUrl: '/complaints/7', // Dummy URL
    },
    {
      id: 8,
      summary: 'Public gathering without permission. Violation of regulations.',
      hasProof: false,
      imageUrl: '/gathering.jpg',
      likes: 30,
      dislikes: 5,
      shares: 3,
      comments: 0,
      timestamp: '2 days ago',
      location: 'Town Square',
      witnesses: 0,
      originalComplaintUrl: '/complaints/8', // Dummy URL
    },
  ]);

  const router = useRouter();

  const handleLike = (id: number) => {
    setCrimePosts(prevPosts =>
      prevPosts.map(post =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleDislike = (id: number) => {
    setCrimePosts(prevPosts =>
      prevPosts.map(post =>
        post.id === id ? { ...post, dislikes: post.dislikes + 1 } : post
      )
    );
  };

  const handleCollaborateClick = (id: number) => {
    router.push(`/collaborate/${id}`);
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
      }}>My Feed</h1>
      <div style={{
        width: '80%',
        maxWidth: '800px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
      }}>
        {crimePosts.map((post) => (
          <div key={post.id} style={{
            border: '1px solid #333',
            borderRadius: '12px',
            backgroundColor: '#2C2C2C',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            padding: '15px',
            transition: 'transform 0.2s ease-in-out',
          }}>
            {post.imageUrl && (
              <Image
                src={post.imageUrl}
                alt={post.summary}
                width={300}
                height={200}
                style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
              />
            )}
            <CrimePost summary={post.summary} />
            <ProofIndicator hasProof={post.hasProof} />
            <div style={{
              marginTop: '10px',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
              <button style={{ ...actionButtonStyle, backgroundColor: post.likes > 100 ? 'lightgreen' : 'teal' }} onClick={() => handleLike(post.id)}>
                <FaHeart style={{ marginRight: '5px' }} />
                {post.likes}
              </button>
              <button style={{ ...actionButtonStyle, backgroundColor: post.dislikes > 10 ? 'orange' : 'teal' }} onClick={() => handleDislike(post.id)}>
                <FaThumbsDown style={{ marginRight: '5px' }} />
                {post.dislikes}
              </button>
              <button style={actionButtonStyle}><FaShare style={{ marginRight: '5px' }} /> {post.shares}</button>
              <button style={actionButtonStyle} onClick={() => handleCollaborateClick(post.id)}>
                <FaComments style={{ marginRight: '5px' }} /> {post.comments} Collaborate
              </button>
              {post.originalComplaintUrl && (
                <button style={actionButtonStyle}>
                  <a href={post.originalComplaintUrl} style={{ color: '#F0F0F0', textDecoration: 'none' }}>Read More</a>
                </button>
              )}
            </div>
            <div style={{
              marginTop: '10px',
              fontSize: '0.8em',
              color: '#888',
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <span>{post.timestamp}</span>
              <span>{post.location}</span>
              {post.witnesses > 0 && <span>Witnesses: {post.witnesses}</span>}
            </div>
          </div>
        ))}
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
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
};