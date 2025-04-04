interface ProofIndicatorProps {
    hasProof: boolean;
  }
  
  const ProofIndicator: React.FC<ProofIndicatorProps> = ({ hasProof }) => {
    return <span>Proof: {hasProof ? 'Attached' : 'Not Attached'}</span>;
  };
  
  export default ProofIndicator;