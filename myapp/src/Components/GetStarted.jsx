import React from 'react';
import { useNavigate } from 'react-router-dom';

const GetStarted = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation

  const handleClick = () => {
    navigate('/fishmap'); // 👉 Navigate to the "Update" page
  };

  return (
    <div className='text-center px-6'>
      {/* Heading and Description */}
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Ready to Dive In?</h2>
      <p className="text-gray-600">Explore the potential of sustainable fishing with us.</p>
      <p className="text-gray-600 mb-6">Join the movement to preserve our oceans and boost your yield.</p>

      <div className="relative inline-flex items-center justify-center gap-4 group">
        <div
          className="absolute inset-0 duration-1000 opacity-60 transition-all bg-gradient-to-r from-blue-600 via-teal-500 to-cyan-400 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200"
        ></div>

        <button
          onClick={handleClick} // 👈 Navigation on click
          className="group relative inline-flex items-center justify-center text-base rounded-xl bg-gray-900 px-8 py-3 font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30"
        >
          Get Started For Free
          <svg
            aria-hidden="true"
            viewBox="0 0 10 10"
            height="10"
            width="10"
            fill="none"
            className="mt-0.5 ml-2 -mr-1 stroke-white stroke-2"
          >
            <path
              d="M0 5h7"
              className="transition opacity-0 group-hover:opacity-100"
            ></path>
            <path
              d="M1 1l4 4-4 4"
              className="transition group-hover:translate-x-[3px]"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default GetStarted;
