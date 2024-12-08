import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PlanSelectionProps {
  onComplete?: () => void;
}

interface Plan {
  name: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

const plans: Plan[] = [
  {
    name: 'Free',
    price: '$0',
    features: [
      'Block up to 3 websites',
      'Basic notifications',
      'Single device',
      'Manual website blocking',
      'Register 1 accountability buddy'
    ]
  },
  {
    name: 'Premium',
    price: '$2.99/month',
    features: [
      'Unlimited website blocking',
      'Incognito mode detection',
      'Sync across devices',
      'Register up to 3 buddies',
      'Custom blocking schedules',
      'Priority support'
    ],
    isPopular: true
  }
];

const PlanSelection: React.FC<PlanSelectionProps> = ({ onComplete }) => {
  const navigate = useNavigate();

  const handleSelectPlan = (planName: string) => {
    chrome.storage.sync.set({ selectedPlan: planName }, () => {
      if (onComplete) {
        onComplete();
      }
      if (planName === 'Premium') {
        navigate('/home');
      } else {
        navigate('/home');
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6">Choose Your Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative p-4 bg-white rounded-lg shadow-lg w-full max-w-xs mx-auto ${
              plan.isPopular ? 'border-2 border-blue-500' : ''
            }`}
          >
            {plan.isPopular && (
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-0.5 rounded-full text-xs">
                Most Popular
              </span>
            )}
            <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
            <p className="text-xl font-bold mb-3">{plan.price}</p>
            <ul className="mb-4 space-y-1 text-sm">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg
                    className="w-3 h-3 mr-2 text-green-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSelectPlan(plan.name)}
              className={`w-full py-2 rounded-lg text-sm ${
                plan.isPopular
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Select {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanSelection; 