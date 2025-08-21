// components/LeftTextBox.jsx
import React from 'react';

const LeftTextBox = () => {
  return (
    <div className="absolute top-1/2 left-20 transform -translate-y-1/2 text-white max-w-sm">
      <h1 className="text-4xl font-bold mb-4 drop-shadow-md">Ocean Insight</h1>
      <p className="text-2xl leading-relaxed drop-shadow-md">
        Discover the diverse marine life.<br />
        Learn about species, habitats,<br />
        and ocean conservation efforts.<br />
        Join the movement for a better future.
      </p>
    </div>
  );
};

export default LeftTextBox;