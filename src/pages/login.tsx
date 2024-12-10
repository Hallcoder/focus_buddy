import React, { useEffect } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomInput from "../components/input";
import CryptoJS from "crypto-js";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const firebaseErrors: { [key: string]: string } = {
  "auth/invalid-email": "The email address is not valid.",
  "auth/user-disabled": "This user has been disabled.",
  "auth/user-not-found": "No user found with this email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/too-many-requests": "Too many requests. Please try again later.",
  "auth/network-request-failed": "Network error. Please check your connection.",
};

function Login() {
  const navigate = useNavigate();

  // Check if the user is already authenticated on component load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is already logged in:", user);
        navigate("/home"); // Redirect to home if already authenticated
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [navigate]);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const secretKey = 'your-secret-key';

  const encryptToken = (token: string) => {
    return CryptoJS.AES.encrypt(token, secretKey).toString();
  };

  const handleGoogleSignIn = async () => {
    try {
      // Get the Google Auth Provider token
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      // Send the token to your backend
      const response = await fetch('http://localhost:3000/auth/google/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate with backend');
      }

      const data = await response.json();
      
      // Check if user exists in your database
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // New user - redirect to onboarding
        navigate("/onboarding");
      } else {
        // Existing user - redirect to home
        navigate("/home");
      }

    } catch (error: any) {
      const errorMessage = firebaseErrors[error.code as keyof typeof firebaseErrors] || 
                          "An unexpected error occurred. Please try again.";
      console.error('Authentication error:', errorMessage);
      throw error;
    }
  };

  const handleSubmit = async (
    values: any,
    { setSubmitting, setErrors, setStatus }: any
  ) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      // Check if the email is verified
      if (!userCredential.user.emailVerified) {
        throw new Error("Please verify your email before logging in.");
      }

      console.log("User logged in successfully:", userCredential.user);
      navigate("/home");
    } catch (error: any) {
      const errorMessage =
        firebaseErrors[error.code as keyof typeof firebaseErrors] ||
        error.message ||
        "An unexpected error occurred. Please try again.";
      setErrors({ general: errorMessage });
      setStatus(errorMessage);
      console.error("Error logging in:", errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <img src={logo} alt="logo" className="h-[10vh] m-2 w-45" />
      <h1 className="font-semibold m-2 p-2 text-3xl">Login</h1>

      <button
        onClick={handleGoogleSignIn}
        className="flex items-center justify-center gap-2 p-2 border rounded-md hover:bg-gray-50 transition-colors w-8/12"
      >
        <img 
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
          alt="Google" 
          className="w-6 h-6"
        />
        Continue with Google
      </button>
      <p className="font-semibold m-2">OR</p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, isSubmitting, status }) => (
          <Form className="w-8/12">
            <CustomInput
              name="email"
              label="Email"
              placeholder="Email..."
              type="email"
              value={values.email}
              onChange={handleChange}
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-xs"
            />

            <CustomInput
              name="password"
              label="Password"
              placeholder="Password..."
              type="password"
              value={values.password}
              onChange={handleChange}
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-xs"
            />

            {status && <div className="text-red-500 font-serif">{status}</div>}

            <button
              type="submit"
              className="p-3 w-full rounded-md my-3 text-white bg-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>
      <p className="m-1">
        <Link to="/reset-password" className="font-semibold text-primary underline">Forgot Password</Link>
      </p>
      <p className="m-2">
        Don't have an account?{" "}
        <Link to="/signup" className="font-semibold text-primary underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default Login;
