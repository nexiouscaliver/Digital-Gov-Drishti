"use client";
import React, { useState, useEffect } from 'react';

const RegisterPage = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpTimer, setOtpTimer] = useState(60); // OTP valid for 60 seconds
    const [idProof, setIdProof] = useState<File | null>(null);
    const [idProofName, setIdProofName] = useState<string>('');

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (otpSent && otpTimer > 0) {
            intervalId = setInterval(() => {
                setOtpTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }
        return () => clearInterval(intervalId);
    }, [otpSent, otpTimer]);

    const sendOtp = async () => {
        // Implement OTP sending logic here (e.g., using an API)
        console.log('Sending OTP to:', phoneNumber);
        setOtpSent(true);
        setOtpTimer(60);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Implement registration logic here
        console.log('Registering with:', { phoneNumber, email, password, otp, idProof });
    };

    const handleIdProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setIdProof(file);
            setIdProofName(file.name);
        } else {
            setIdProof(null);
            setIdProofName('');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
            <h2 className="text-3xl font-bold mb-4 text-white text-center animate-fade-in">DRISHTI</h2>
            <div className="shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 border border-black animate-slide-up bg-zinc-900" style={{ maxWidth: '500px', width: '90%' }}>
                <h2 className="text-2xl font-bold mb-6 text-white text-center">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-zinc-300 text-sm font-bold mb-2" htmlFor="phoneNumber">
                            Phone Number
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-blue-100 leading-tight focus:outline-none focus:shadow-outline bg-zinc-700 text-white"
                            id="phoneNumber"
                            type="tel"
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            style={{ width: 'calc(100% - 0px)' }}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-zinc-300 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-blue-100 leading-tight focus:outline-none focus:shadow-outline bg-zinc-700 text-white"
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: 'calc(100% - 0px)' }}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-zinc-300 text-sm font-bold mb-2" htmlFor="password">
                            Create Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-blue-100 leading-tight focus:outline-none focus:shadow-outline bg-zinc-700 text-white"
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: 'calc(100% - 0px)' }}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-zinc-300 text-sm font-bold mb-2" htmlFor="confirmPassword">
                            Re-enter Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-blue-100 mb-3 leading-tight focus:outline-none focus:shadow-outline bg-zinc-700 text-white"
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{ width: 'calc(100% - 0px)' }}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-zinc-300 text-sm font-bold mb-2" htmlFor="otp">
                            OTP
                        </label>
                        <div className="flex items-center">
                            <input
                                className="shadow appearance-none border rounded py-2 px-3 text-blue-100 leading-tight focus:outline-none focus:shadow-outline bg-zinc-700 text-white w-32"
                                id="otp"
                                type="text"
                                placeholder="OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={sendOtp}
                                disabled={otpSent}
                            >
                                {otpSent ? `Resend OTP (${otpTimer}s)` : 'Send OTP'}
                            </button>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-zinc-300 text-sm font-bold mb-2" htmlFor="idProof">
                            Valid ID Proof
                        </label>
                        <div className="flex items-center">
                            <label htmlFor="idProofInput" className="cursor-pointer py-2 px-4 rounded bg-blue-500 hover:bg-blue-700 text-white font-bold focus:outline-none focus:shadow-outline">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 inline-block mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.88-3.523M17.25 19.5a4.5 4.5 0 001.88-3.523M3.75 12h16.5" />
                                </svg>
                                Choose a file
                            </label>
                            <input
                                id="idProofInput"
                                type="file"
                                className="hidden"
                                onChange={handleIdProofChange}
                                required
                            />
                            {idProofName && <span className="ml-2 text-zinc-400">{idProofName}</span>}
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;