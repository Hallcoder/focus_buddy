import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingStep {
  title: string;
  description: string;
  illustration: string;
}

const steps: OnboardingStep[] = [
  {
    title: "Block Distracting Sites",
    description: "Easily block websites that harm your productivity",
    illustration: "/illustrations/block_ads.png"
  },
  {
    title: "Stay Accountable",
    description: "Add a buddy who gets paid when you break your commitments",
    illustration: "/illustrations/stay_accountable.png"
  },
  {
    title: "Track Progress",
    description: "Monitor your improvement and stay motivated",
    illustration: "/illustrations/track_progress.png"
  }
];

function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="fixed inset-0 bg-white z-50">
      <AnimatePresence>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="h-full flex flex-col items-center justify-center p-4"
        >
          <img 
            src={steps[currentStep].illustration} 
            alt={steps[currentStep].title}
            className="w-64 h-64 mb-8"
          />
          <h2 className="text-2xl font-bold mb-4">{steps[currentStep].title}</h2>
          <p className="text-gray-600 mb-8 text-center">{steps[currentStep].description}</p>
          
          <div className="flex gap-4">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-6 py-2 border rounded-md"
              >
                Previous
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-6 py-2 bg-primary text-white rounded-md"
              >
                Next
              </button>
            ) : (
              <button
                onClick={onComplete}
                className="px-6 py-2 bg-primary text-white rounded-md"
              >
                Get Started
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default Onboarding; 