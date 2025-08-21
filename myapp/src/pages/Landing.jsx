import React from 'react';
import Navbar from '../Components/Navbar';
import bgImage from '../assets/bg1.jpg';
import Footer from '../Components/Footer';
import Map from '../Components/Map';
import LeftTextBox from '../Components/LeftTextBox';
import GetStarted from '../Components/GetStarted';
import Weather from '../Components/Weather';

const Landing = () => {
  return (
    <>
      {/* Hero section with background image and glass effect */}
      <div
        className="min-h-screen bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${bgImage})`,
          position: 'relative',
        }}
      >
        <Navbar />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '60px 5%', gap: '20px' }}>
          {/* Left Text */}
          <div style={{ flex: 1 }}>
            <LeftTextBox />
          </div>

          {/* Weather Card */}
          <div style={weatherContainerStyle}>
            <Weather />
          </div>
        </div>
      </div>

      {/* Map and GetStarted side by side */}
      <div className="flex justify-center items-center py-16 bg-gray-100">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Map Card */}
          <div className="bg-white p-6 rounded-2xl shadow-2xl transition duration-300">
            <Map />
          </div>

          {/* GetStarted Button */}
          <div className="mt-6 md:mt-0">
            <GetStarted />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

const weatherContainerStyle = {
  flex: '0 0 320px',
  height: 'auto',
  backdropFilter: 'blur(14px)',
  background: 'rgba(255, 255, 255, 0.2)',
  borderRadius: '18px',
  padding: '20px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
  color: '#fff',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  marginTop: '80px'
};

export default Landing;
