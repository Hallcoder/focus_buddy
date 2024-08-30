import React from 'react';
import google from "../assets/google.jpeg";
const ContinueWithGoogleButton = () => {
  return (
    <div className="w-8/12 flex items-center justify-center p-3 border border-primary rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer">
      {/* Replace the src with the path to your Google icon */}
      <img 
        src={google} 
        alt="Google Icon" 
        className="w-6 h-6 mr-2" 
      />
      <span className="text-primary font-medium">Continue with Google</span>
    </div>
  );
};

export default ContinueWithGoogleButton;
