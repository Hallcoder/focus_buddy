import ContinueWithGoogleButton from "../components/GoogleButton";
import logo from "../assets/logo.png";
import CustomInput from "../components/input";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCustomToken
} from "firebase/auth";
import { auth, db } from "../config/firebase";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { doc, setDoc } from "firebase/firestore";
import { useEffect } from "react";

const firebaseErrors: { [key: string]: string } = {
  "auth/email-already-in-use": "This email is already in use.",
  "auth/invalid-email": "The email address is not valid.",
  "auth/weak-password":
    "The password is too weak. Please use at least 6 characters.",
  "auth/user-not-found": "No user found with this email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/too-many-requests": "Too many requests. Please try again later.",
  "auth/network-request-failed": "Network error. Please check your connection.",
  "auth/popup-closed-by-user": "Sign-in popup was closed before completing.",
  "auth/cancelled-popup-request": "The sign-in popup was cancelled.",
  "auth/popup-blocked": "Sign-in popup was blocked by the browser.",
  "auth/account-exists-with-different-credential": 
    "An account already exists with the same email address but different sign-in credentials.",
};

function Signup() {
  const navigate = useNavigate();

  const initialValues = {
    username: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (
    values: any,
    { setSubmitting, setStatus }: any
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      await updateProfile(userCredential.user, {
        displayName: values.username,
      });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: userCredential.user.email,
        blocked_urls: [],
        moderating: [],
        moderators: [],
        name: values.username,
      });

      await sendEmailVerification(userCredential.user);
      console.log("User signed up successfully:", userCredential.user);
      navigate("/login");
    } catch (error: any) {
      const errorMessage =
        firebaseErrors[error.code as keyof typeof firebaseErrors] ||
        "An unexpected error occurred. Please try again.";
      setStatus(errorMessage);
      console.error("Error signing up:", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      // Redirect to backend's Google OAuth endpoint
      window.location.href = 'http://localhost:3000/auth/google';
    } catch (error: any) {
      const errorMessage = firebaseErrors[error.code as keyof typeof firebaseErrors] || 
                          "An unexpected error occurred. Please try again.";
      console.error('Authentication error:', error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center border-4 border-red-400">
      <img src={logo} alt="logo" className="h-[10vh] m-2 w-45" />
      <h1 className="font-semibold m-2 p-2 text-3xl">Signup</h1>
      <button
        onClick={handleGoogleSignup}
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
        {({ values, handleChange, handleBlur, isSubmitting, status }) => (
          <Form className="w-8/12">
            <CustomInput
              name="username"
              label="Username"
              type="text"
              placeholder="Username..."
              value={values.username}
              onChange={handleChange}
            />
            <ErrorMessage
              name="username"
              component="div"
              className="text-red-500 text-xs"
            />

            <CustomInput
              name="email"
              label="Email"
              type="email"
              placeholder="Email..."
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
              type="password"
              placeholder="Password..."
              value={values.password}
              onChange={handleChange}
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-xs"
            />

            {/* Display general error message */}
            {status && <div className="text-red-500 font-serif">{status}</div>}

            <button
              type="submit"
              className="p-3 w-full rounded-md my-3 text-white bg-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </Form>
        )}
      </Formik>
      <p className="m-2">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-primary underline">
          Login
        </Link>
      </p>
    </div>
  );
}

export default Signup;
