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
      imageUrl: '/theft.jpg',
      likes: 120,
      dislikes: 15,
      shares: 30,
      comments: 5,
      timestamp: '1 hour ago',
      location: 'Central Market',
      witnesses: 3,
      originalComplaintUrl: '/complaints/1',
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
      originalComplaintUrl: '/complaints/2',
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
      originalComplaintUrl: '/complaints/3',
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
      originalComplaintUrl: '/complaints/4',
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
      originalComplaintUrl: '/complaints/5',
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
      originalComplaintUrl: '/complaints/6',
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
      originalComplaintUrl: '/complaints/7',
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
      originalComplaintUrl: '/complaints/8',
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
      backgroundColor: 'zinc-950', // Darkest background
      padding: '20px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: 'zinc-400', // Lighter text
    }}>
      <h1 style={{
        color: 'white',
        textAlign: 'center',
        marginBottom: '20px',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
        background: 'linear-gradient(to right, purple, blue)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
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
            border: '1px solid zinc-800',
            borderRadius: '16px',
            backgroundColor: 'zinc-900', // Lighter dark background for cards
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)', // More pronounced shadow
            padding: '15px',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            // ':hover' pseudo-class moved to CSS
          }}>
            {post.imageUrl && (
              <Image
                src={post.imageUrl}
                alt={post.summary}
                width={300}
                height={200}
                style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '16px 16px 0 0' }}
              />
            )}
            <CrimePost summary={post.summary} />
            <ProofIndicator hasProof={post.hasProof} />
            <div style={{
              marginTop: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}>
              <button style={{ ...actionButtonStyle, backgroundColor: post.likes > 100 ? 'rgba(124, 58, 237, 0.8)' : 'rgba(124, 58, 237, 0.5)' }} onClick={() => handleLike(post.id)}>
                <FaHeart style={{ marginRight: '5px' }} />
                {post.likes}
              </button>
              <button style={{ ...actionButtonStyle, backgroundColor: post.dislikes > 10 ? 'rgba(74, 222, 128, 0.8)' : 'rgba(74, 222, 128, 0.5)' }} onClick={() => handleDislike(post.id)}>
                <FaThumbsDown style={{ marginRight: '5px' }} />
                {post.dislikes}
              </button>
              <button style={{ ...actionButtonStyle, backgroundColor: 'rgba(56, 189, 248, 0.5)' }}><FaShare style={{ marginRight: '5px' }} /> {post.shares}</button>
              <button style={{ ...actionButtonStyle, backgroundColor: 'rgba(168, 85, 247, 0.5)' }} onClick={() => handleCollaborateClick(post.id)}>
                <FaComments style={{ marginRight: '5px' }} /> {post.comments} Collaborate
              </button>
            </div>
            <div style={{
              marginTop: '10px',
              fontSize: '0.8em',
              color: 'zinc-500',
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
  //backgroundColor: 'rgba(124, 58, 237, 0.5)', // Purple accent
  border: 'none',
  padding: '10px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  color: 'white',
  transition: 'background-color 0.3s ease-in-out, transform 0.1s ease-in-out',
  '&:hover': {
    backgroundColor: 'rgba(124, 58, 237, 0.8)', // Darker purple on hover
    transform: 'scale(1.05)',
  },
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  justifyContent: 'center',
  flex: 1,
  margin: '0 5px',
};