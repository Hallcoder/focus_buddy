import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";

// Your encryption key
const secretKey = 'your-secret-key'; 

const encryptToken = (token:string) => {
  return CryptoJS.AES.encrypt(token, secretKey).toString();
};


const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const handleGoogleLoginSuccess = async (credentialResponse:CredentialResponse) => {
    try {
      const token = credentialResponse.credential; // Extract token from the response
      const encryptedToken = encryptToken(token!); // Encrypt the token
  
      // Store the token securely
      chrome.storage.local.set({ authToken: encryptedToken }, () => {
        console.log('Google token is saved.');
      });
  
      console.log("User logged in successfully with Google.");
      navigate("/home"); // Navigate to the home page
    } catch (error:any) {
      console.error("Error handling Google login:", error.message);
    }
  };
  
  const handleGoogleLoginError = () => {
    console.log("Login Failed");
  };
  
  return (
    <GoogleLogin
      onSuccess={handleGoogleLoginSuccess}
      onError={handleGoogleLoginError}
    />
  );
};

export default GoogleLoginButton;
