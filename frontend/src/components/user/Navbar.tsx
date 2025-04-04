import Link from 'next/link';

const Navbar = () => {
  return (
    <nav style={{ 
      backgroundColor: 'lightyellow', // Background color for the navbar
      padding: '30px 30px',
      display: 'flex',
      justifyContent: 'flex-end', // Align items to the right
      alignItems: 'center',
    }}>
      <ul style={{ 
        listStyleType: 'none', 
        display: 'flex', 
        gap: '20px', // Spacing between links
        margin: 0,
        padding: 0,
      }}>
        <li><Link href="/" style={{ textDecoration: 'none', color: 'black' }}>My Feed</Link></li>
        <li><Link href="/my-complaints" style={{ textDecoration: 'none', color: 'black' }}>My Complaints</Link></li>
        <li><Link href="/hot-topic" style={{ textDecoration: 'none', color: 'black' }}>Hot Topic</Link></li>
        <li><Link href="/upskill" style={{ textDecoration: 'none', color: 'black' }}>Upskill</Link></li>
        {/* Add a logout link if needed */}
      </ul>
    </nav>
  );
};

export default Navbar;