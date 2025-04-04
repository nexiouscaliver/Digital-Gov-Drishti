"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
    const [usernameOrPhone, setUsernameOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Logging in with:', { usernameOrPhone, password });
        router.push('/');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
            <h2 className="text-3xl font-bold mb-6 text-white text-center">DRISHTI</h2>
            <div className="bg-gray-900 shadow-md rounded px-8 pt-6 pb-8 mb-4 border border-gray-700 animate-fade-in" style={{ maxWidth: '600px', width: '90%' }}>
                <h3 className="text-xl font-semibold mb-4 text-gray-300 text-center">Login</h3>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="usernameOrPhone">
                            Username or Phone Number
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
                            id="usernameOrPhone"
                            type="text"
                            placeholder="Username or Phone Number"
                            value={usernameOrPhone}
                            onChange={(e) => setUsernameOrPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Login
                        </button>
                    </div>
                </form>
                <p className="mt-4 text-center text-gray-300">
                    Not registered? <a href="/gov/register" className="text-blue-500 hover:text-blue-800">Sign up here</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;