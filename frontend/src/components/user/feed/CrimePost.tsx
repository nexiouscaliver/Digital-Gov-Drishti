interface CrimePostProps {
    summary: string;
  }
  
  const CrimePost: React.FC<CrimePostProps> = ({ summary }) => {
    return <p>{summary}</p>;
  };
  
  export default CrimePost;