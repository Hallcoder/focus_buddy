import { useContext } from "react";
import { AuthContext } from "../config/authProvider"; // Import the AuthContext

function useAuth() {
  return useContext(AuthContext);  // Access AuthContext
}

export default useAuth;
