import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App/App";
import "../index.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { HashRouter, Routes, Route } from "react-router-dom";
import TestPage from "../pages/login";
import Signup from "../pages/signup";
import Home from "../pages/home";

console.log("ID",process.env.REACT_APP_GOOGLE_CLIENT_ID);
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={"771820500935-3ppaku63hos7gih0oinj5o11hs2433go.apps.googleusercontent.com"}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<TestPage />} />
          {/* Add more routes here as needed */}
        </Routes>
      </HashRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
export {};
