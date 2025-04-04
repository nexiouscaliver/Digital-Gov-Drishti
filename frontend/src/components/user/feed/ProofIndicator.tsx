interface ProofIndicatorProps {
    hasProof: boolean;
  }
  
  const ProofIndicator: React.FC<ProofIndicatorProps> = ({ hasProof }) => {
    return (
      <div style={{
        marginTop: '8px',
        padding: '5px 10px',
        backgroundColor: hasProof ? 'green' : 'red',
        borderRadius: '4px',
        color: 'white',
        display: 'inline-block',
      }}>
        Proof: {hasProof ? 'Available' : 'Not Available'}
      </div>
    );
  };
  
  export default ProofIndicator;