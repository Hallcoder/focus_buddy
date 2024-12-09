import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import CustomInput from "../components/input"; // Assuming CustomInput is in the right path
import { auth, db } from "../config/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import toast from "react-hot-toast";
import { fetchUserByEmail } from "../utils/firebaseFunctions";

interface BuddyFormValues {
  buddyEmail: string;
  nickname: string;
  penaltyAmount: number;
  paymentMethod: string;
  paymentDetails: string;
}

interface BuddyConfig {
  email: string;
  nickname: string;
  penaltyAmount: number;
  paymentMethod: 'paypal' | 'venmo' | 'cashapp';
  paymentDetails: string;
  addedAt: string;
}

function AddChosenBuddies() {
  const navigate = useNavigate();

  const handleAddBuddy = async (
    values: BuddyFormValues,
    { resetForm }: any
  ) => {
    const buddyEmail = values.buddyEmail.trim();
    const user = auth.currentUser;

    if (!user) {
      toast.error("No authenticated user found.");
      navigate("/login");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const currentBuddies = userData.moderators || [];
        const currentBuddyConfigs = userData.buddyConfigs || {};

        if (buddyEmail === userData.email) {
          throw new Error("You can't be your own Buddy, that's cheating! 😂");
        }

        if (currentBuddies.includes(buddyEmail)) {
          throw new Error("This buddy is already in your list.");
        }

        // Create buddy configuration
        const buddyConfig: BuddyConfig = {
          email: buddyEmail,
          nickname: values.nickname,
          penaltyAmount: values.penaltyAmount,
          paymentMethod: values.paymentMethod as 'paypal' | 'venmo' | 'cashapp',
          paymentDetails: values.paymentDetails,
          addedAt: new Date().toISOString()
        };

        // Update Firestore document
        await updateDoc(userDocRef, {
          moderators: [...currentBuddies, buddyEmail],
          buddyConfigs: {
            ...currentBuddyConfigs,
            [buddyEmail]: buddyConfig
          }
        });

        // Also update the buddy's document to add them as a moderator
        const buddyQuery = await fetchUserByEmail(buddyEmail);
        if (buddyQuery) {
          const buddyDocRef = doc(db, "users", buddyQuery.uid);
          await updateDoc(buddyDocRef, {
            moderating: arrayUnion(user.email)
          });
        }

        await sendWelcomeEmailToBuddy(buddyEmail, user.email);
        
        toast.success("Buddy added successfully!");
        resetForm();
      } else {
        throw new Error("User document not found.");
      }
    } catch (error: any) {
      toast.error(`Error adding buddy: ${error.message}`);
    }
  };

  const validationSchema = Yup.object({
    buddyEmail: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
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

  const sendWelcomeEmailToBuddy = async (buddyEmail: string, userEmail: string | null) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user found");

      // Get user's name from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      const userName = userDocSnap.exists() ? userDocSnap.data().name || userEmail : userEmail;

      const response = await fetch("http://localhost:3000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buddyEmail: buddyEmail,
          userName: userName,
          text: `Hello! ${userName} has added you as their accountability buddy. You'll receive notifications when they visit sites they're trying to avoid. No account needed - we'll just send you email notifications!`
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Welcome email sent successfully:", result);
    } catch (error) {
      console.error("Error sending welcome email:", error);
      // Don't throw error here - we don't want to prevent buddy addition if email fails
      toast.error("Added buddy but failed to send welcome email. They will still receive notifications.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <button
        onClick={() => navigate(-1)}
        className="self-start mb-4 text-primary hover:text-primary"
      >
        ← Back
      </button>
      <h2 className="font-semibold text-2xl mb-4">Add a Buddy ✌️</h2>
      <p className="text-gray-600 mb-6 text-center">
        Your buddy will receive money when you visit blocked sites
      </p>
      
      <Formik
        initialValues={{ 
          buddyEmail: "",
          nickname: "",
          penaltyAmount: 1,
          paymentMethod: "paypal",
          paymentDetails: ""
        }}
        validationSchema={validationSchema}
        onSubmit={handleAddBuddy}
      >
        {({ isSubmitting, handleChange, errors, touched }) => (
          <Form className="w-full max-w-md space-y-4">
            <CustomInput
              name="buddyEmail"
              label="Buddy's Email"
              type="email"
              onChange={handleChange}
              placeholder="Enter buddy's email"
            />

            <CustomInput
              name="nickname"
              label="Buddy's Nickname"
              type="text"
              onChange={handleChange}
              placeholder="Enter a nickname for your buddy"
            />

            <div>
              <CustomInput
                name="penaltyAmount"
                label="Penalty Amount ($)"
                type="number"
                min="1"
                onChange={handleChange}
                placeholder="Enter amount"
              />
              {errors.penaltyAmount && touched.penaltyAmount && (
                <div className="text-red-500 text-sm">{errors.penaltyAmount}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                name="paymentMethod"
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
              onChange={handleChange}
              placeholder="Enter PayPal email / Venmo username / Cash App $cashtag"
            />

            <button
              type="submit"
              className="p-3 w-full rounded-md text-white bg-primary hover:bg-primary-dark transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Buddy"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AddChosenBuddies;
