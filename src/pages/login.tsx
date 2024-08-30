import ContinueWithGoogleButton from "../components/GoogleButton";
import logo from "../assets/logo.png";
import CustomInput from "../components/input";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../config/firebase";
function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async(e:React.FormEvent) =>{
    e.preventDefault();
    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
  
      // Optionally handle other tasks like redirecting the user or showing a success message
      console.log("User signed up successfully:", userCredential.user);
    } catch (error:any) {
      // Handle errors here
      console.error("Error signing up:", error.message);
    }
  }
  return (
    <div className="flex flex-col justify-center items-center border-4 border-red-400">
      <img src={logo} alt="logo" className="h-[10vh] m-2 w-45" />
      <h1 className="font-semibold m-2 p-2 text-3xl">Login</h1>
      <ContinueWithGoogleButton />
      <p className="font-semibold m-2">OR</p>
      <form className="w-8/12">
        <CustomInput name="email" label="Email" placeholder="Email..." type="email" value={formData.email} onChange={handleInputChange}/>
        <CustomInput name="password" label="Password" type="password" placeholder="password..." value={formData.email} onChange={handleInputChange}/>
        <button onClick={handleSubmit} className="p-3 w-full rounded-md my-3 text-white bg-primary">Login</button>
      </form>
      <p className="m-2">Don't have an account? <Link to='/signup' className="font-semibold text-primary underline">Sign up</Link></p>
    </div>
  );
}

export default Login;
