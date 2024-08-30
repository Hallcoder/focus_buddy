import React from 'react';

const FloatingActionButton = ({ onClick }:{onClick:any}) => {
  return (
    <button
      onClick={onClick}
      className="relative
        w-10 h-10 
        bg-primary text-white 
        p-4 rounded-full flex items-center justify-center
        shadow-lg hover:bg-primary 
        transition-all duration-300 
        focus:outline-none
      "
    >
      {/* You can replace this with an icon */}
      +
    </button>
  );
};

export default FloatingActionButton;
