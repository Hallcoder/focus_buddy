import ContinueWithGoogleButton from "../components/GoogleButton";
import logo from "../assets/logo.png";
import CustomInput from "../components/input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../config/firebase";
function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error,setError] = useState();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update the user's profile with the username
      await updateProfile(userCredential.user, {
        displayName: formData.username,
      });

      // Optionally handle other tasks like redirecting the user or showing a success message
      console.log("User signed up successfully:", userCredential.user);
    } catch (error: any) {
      setError(error.message);
      console.error("Error signing up:", error.message);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center border-4 border-red-400">
      <img src={logo} alt="logo" className="h-[10vh] m-2 w-45" />
      <h1 className="font-semibold m-2 p-2 text-3xl">Signup</h1>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
          navigate("/home");
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
      ;<p className="font-semibold m-2">OR</p>
      {error && <div className="text-red-400 font-serif">Error occurred</div>}
      <form className="w-8/12">
        <CustomInput
          name="username"
          label="Username"
          type="text"
          placeholder="username..."
          value={formData.username}
          onChange={handleInputChange}
        />
        <CustomInput
          name="email"
          label="Email"
          placeholder="Email..."
          type="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <CustomInput
          name="password"
          label="Password"
          type="password"
          placeholder="password..."
          value={formData.password}
          onChange={handleInputChange}
        />
        <button onClick={handleSubmit} className="p-3 w-full rounded-md my-3 text-white bg-primary">
          Register
        </button>
      </form>
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
