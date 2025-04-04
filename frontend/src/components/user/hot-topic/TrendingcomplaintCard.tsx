import Image from 'next/image';

interface TrendingComplaintCardProps {
  id: number;
  summary: string;
  engagement: string;
  discussionCount: number;
  imageUrl: string;
}

const TrendingComplaintCard: React.FC<TrendingComplaintCardProps> = ({
  id,
  summary,
  engagement,
  discussionCount,
  imageUrl,
}) => {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={`Image related to ${summary}`}
          width={300} // Adjust as needed
          height={200}
          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
        />
      )}
      <div style={{ padding: '15px' }}>
        <h3>{summary}</h3>
        <p>Engagement: {engagement}</p>
        <p>Discussions: {discussionCount}</p>
        <button style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default TrendingComplaintCard;