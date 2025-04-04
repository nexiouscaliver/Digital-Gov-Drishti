"use client"; // Important for Next.js App Router and useRouter

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();
  const [heroAnimation, setHeroAnimation] = useState(false);
  const [stepAnimations, setStepAnimations] = useState([false, false, false, false]);
  const [mapPulse, setMapPulse] = useState(false);

  useEffect(() => {
    setHeroAnimation(true);
    setTimeout(() => {
      setStepAnimations([true, true, true, true]);
    }, 500);
    setTimeout(() => {
      setMapPulse(true);
    }, 2000);

  }, []);

  const handleReportClick = () => {
    router.push('/user/login'); // Replace with your report page route
  };

  const handleOfficerLogin = () => {
      router.push('/gov/login') //replace with your officer login page.
  }
  const mapData = [
    { region: 'Delhi', reports: 120, successfulCases: 80, engagement: 'High' },
    { region: 'Mumbai', reports: 90, successfulCases: 60, engagement: 'Medium' },
    { region: 'Bangalore', reports: 150, successfulCases: 110, engagement: 'Very High' },
    { region: 'Chennai', reports: 70, successfulCases: 40, engagement: 'Low' },
    { region: 'Kolkata', reports: 110, successfulCases: 75, engagement: 'Medium' },
  ];
  return (
    <div className="bg-zinc-950 text-white">
      {/* Hero Section */}
      <section className="relative py-24 text-center">
        <div className="container mx-auto">
          <h1 className={`text-4xl font-bold mb-4 ${heroAnimation ? 'opacity-100 transition-opacity duration-1000' : 'opacity-0'}`}>
            DRISHTI: Illuminate Corruption, Empower Transparency.
          </h1>
          <p className={`text-lg mb-8 ${heroAnimation ? 'opacity-100 transition-opacity duration-1000 delay-200' : 'opacity-0'}`}>
            Report corruption anonymously and contribute to a more transparent society.
          </p>
          <div className="space-x-4">
            <button onClick={handleReportClick} className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors shadow-md">
              Report Corruption
            </button>
            <button className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-6 rounded-full transition-colors shadow-md">
              Learn More
            </button>
          </div>
          {/* Add your eye icon animation here, using CSS transitions or libraries like Framer Motion */}
        </div>
      </section>

      {/* How DRISHTI Works Section */}
      <section className="py-24 bg-zinc-900 rounded-lg shadow-md mx-4 md:mx-auto max-w-7xl">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-8">How DRISHTI Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className={`text-center ${stepAnimations[0] ? 'opacity-100 transition-opacity duration-1000' : 'opacity-0'}`}>
              {/* Add your smartphone icon here */}
              <p className="font-semibold mt-4 text-zinc-300">Report Anonymously</p>
            </div>
            <div className={`text-center ${stepAnimations[1] ? 'opacity-100 transition-opacity duration-1000 delay-200' : 'opacity-0'}`}>
              {/* Add your mask icon here */}
              <p className="font-semibold mt-4 text-zinc-300">Provide Evidence</p>
            </div>
            <div className={`text-center ${stepAnimations[2] ? 'opacity-100 transition-opacity duration-1000 delay-400' : 'opacity-0'}`}>
              {/* Add your document icon here */}
              <p className="font-semibold mt-4 text-zinc-300">Track Progress</p>
            </div>
            <div className={`text-center ${stepAnimations[3] ? 'opacity-100 transition-opacity duration-1000 delay-600' : 'opacity-0'}`}>
              {/* Add your people icon here */}
              <p className="font-semibold mt-4 text-zinc-300">Make a Difference</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact and Transparency Section */}
      <section className="py-24 bg-zinc-800 rounded-lg shadow-md mx-4 md:mx-auto max-w-7xl">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-8">Impact and Transparency Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mapData.slice(0, 3).map((data, index) => (
              <div key={index} className="p-4 border rounded-lg shadow-md bg-zinc-900">
                <h3 className="font-semibold mb-2 text-blue-300">{data.region}</h3>
                <p className="text-zinc-100">Reports: {data.reports}</p>
                <p className="text-zinc-100">Cases: {data.successfulCases}</p>
                <p className="text-zinc-100">Engagement: {data.engagement}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Government Officer Portal Section */}
      <section className="py-24 bg-zinc-900 rounded-lg shadow-md mx-4 md:mx-auto max-w-7xl mt-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-8">Empowering Government Transparency</h2>
          {/* Add a mockup of the officer portal here */}
          <button onClick={handleOfficerLogin} className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors block mx-auto shadow-md">
            Officer Login
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-zinc-900 text-white text-center">
        <p>&copy; {new Date().getFullYear()} DRISHTI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;