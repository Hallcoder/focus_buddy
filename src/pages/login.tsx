import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomInput from "../components/input";
import { GoogleLogin } from "@react-oauth/google";
import CryptoJS from "crypto-js";
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

  const encryptToken = (token:string) => {
    return CryptoJS.AES.encrypt(token, secretKey).toString();
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
  
      // Store the token securely
      // const token = await userCredential.user.getIdToken();
      // const encryptedToken = encryptToken(token);
      // chrome.storage.local.set({ authToken: encryptedToken }, () => {
      //   console.log('Token is saved.');
      // });
  
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
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
          navigate("/home");
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
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
