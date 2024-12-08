import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase"; // Firebase config
import { Link } from "react-router-dom";

import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomInput from "../components/input";

const firebaseErrors: { [key: string]: string } = {
  "auth/invalid-email": "The email address is not valid.",
  "auth/user-not-found": "No user found with this email.",
  "auth/network-request-failed": "Network error. Please check your connection.",
  "auth/too-many-requests": "Too many requests. Please try again later.",
};

function ResetPassword() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const handleSubmit = async (
    values: { email: string },
    { setSubmitting, setErrors }: any
  ) => {
    setStatusMessage(null); // Reset the status message
    try {
      // Send password reset email
      await sendPasswordResetEmail(auth, values.email);
      setStatusMessage(
        "A password reset email has been sent to your email address."
      );
    } catch (error: any) {
      const errorMessage =
        firebaseErrors[error.code as keyof typeof firebaseErrors] ||
        "An unexpected error occurred. Please try again.";
      setErrors({ general: errorMessage });
      setStatusMessage(errorMessage);
      console.error("Error sending reset email:", errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <div className="p-6 max-w-sm w-full bg-white rounded-md shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Reset Password</h1>
        <p className="text-sm text-gray-600 text-center mb-4">
          Enter your email address, and we will send you instructions to reset
          your password.
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, isSubmitting }) => (
            <Form className="space-y-4">
              <CustomInput
                name="email"
                label="Email"
                placeholder="Enter your email"
                type="email"
                value={values.email}
                onChange={handleChange}
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-xs"
              />

              {statusMessage && (
                <div
                  className={`${
                    statusMessage.includes("has been sent")
                      ? "text-green-500"
                      : "text-red-500"
                  } font-serif text-sm`}
                >
                  {statusMessage}
                </div>
              )}

              <button
                type="submit"
                className="p-3 w-full rounded-md text-white bg-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending Reset Email..." : "Reset Password"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-4 text-center">
          <p className="text-sm">
            Remember your password?{" "}
            <Link to="/login" className="text-primary font-semibold underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
