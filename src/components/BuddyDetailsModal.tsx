import React, { useEffect, useRef } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import CustomInput from './input';
import { BuddyConfig } from '../functions/migrateSchema';

interface BuddyDetailsModalProps {
  buddyConfig: BuddyConfig;
  onClose: () => void;
  onUpdate: (updatedConfig: BuddyConfig) => void;
}

const BuddyDetailsModal: React.FC<BuddyDetailsModalProps> = ({ buddyConfig, onClose, onUpdate }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const validationSchema = Yup.object({
    nickname: Yup.string()
      .required("Nickname is required")
      .min(2, "Nickname must be at least 2 characters")
      .max(20, "Nickname must be less than 20 characters"),
    penaltyAmount: Yup.number()
      .min(1, "Minimum penalty amount is $1")
      .required("Penalty amount is required"),
    paymentMethod: Yup.string()
      .required("Payment method is required"),
    paymentDetails: Yup.string()
      .required("Payment details are required")
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white p-6 rounded-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Buddy Details</h2>
        <Formik
          initialValues={buddyConfig}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            onUpdate(values);
            onClose();
          }}
        >
          {({ handleChange, values, isSubmitting }) => (
            <Form className="space-y-4">
              <CustomInput
                name="nickname"
                label="Buddy's Nickname"
                type="text"
                value={values.nickname}
                onChange={handleChange}
                placeholder="Enter a nickname for your buddy"
              />
              <CustomInput
                name="penaltyAmount"
                label="Penalty Amount ($)"
                type="number"
                min="1"
                value={values.penaltyAmount.toString()}
                onChange={handleChange}
                placeholder="Enter amount"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={values.paymentMethod}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="paypal">PayPal</option>
                  <option value="venmo">Venmo</option>
                  <option value="cashapp">Cash App</option>
                </select>
              </div>
              <CustomInput
                name="paymentDetails"
                label="Payment Details"
                type="text"
                value={values.paymentDetails}
                onChange={handleChange}
                placeholder="Enter PayPal email / Venmo username / Cash App $cashtag"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md"
                  disabled={isSubmitting}
                >
                  Save
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default BuddyDetailsModal; 