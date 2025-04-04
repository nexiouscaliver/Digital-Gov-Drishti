"use client";
import { useState } from 'react';

interface LoginFormProps {
  isGov: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ isGov }) => {
  const [mobileEmail, setMobileEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Logging in as ${isGov ? 'Gov' : 'User'} with:`, { mobileEmail, password });
    // In a real app, you'd make an API call here
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="mobileEmail">{isGov ? 'Gov ID/Email' : 'Mobile/Email'}</label>
        <input type="text" id="mobileEmail" value={mobileEmail} onChange={(e) => setMobileEmail(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit">{isGov ? 'Gov Login' : 'User Login'}</button>
    </form>
  );
};

export default LoginForm;