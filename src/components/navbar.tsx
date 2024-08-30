import { MdLogout } from "react-icons/md";
import logo from "../assets/logo.png";
import profile from "../assets/profile.jpeg";
function Navbar() {
  return (
    <div className="flex w-full justify-between p-2 items-center">
      <img src={logo} className="h-10 w-20"/>
      <span className="flex text-xs">
        <img src={profile} className="h-10 w-10"/>
        <span>
          <p className="font-semibold">John Doe</p>
          <p>johndoe@example.com</p>
        </span>
      </span>
      <span>
        <MdLogout className="text-gray-500 text-xl" />
      </span>
    </div>
  );
}

export default Navbar;
