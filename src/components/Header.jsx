import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const Header = () => {
  const [page, setPage] = useState("Login");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPage("Profile");
      } else {
        setPage("Login");
      }
    });
  });

  const pathRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };

  return (
    <div className="bg-slate-100 border-b shadow-sm sticky top-0 z-999">
      <header className="flex justify-between items-center sticky top-0 z-50 px-3 max-w-6xl mx-auto bg-slate-100">
        <div className="px-2">
          <img
            onClick={() => navigate("/")}
            className="h-12 cursor-pointer w-36"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQU4AgCCjITMi1Q-U2KrztDcnPoK4_rpwc5g&usqp=CAU"
            alt="RealSand"
          />
        </div>
        <div>
          <ul className="flex space-x-5 sm:space-x-4">
            <li
              onClick={() => navigate("/")}
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${
                pathRoute("/") && "text-black border-b-red-600"
              }`}
            >
              Home
            </li>
            <li
              onClick={() => navigate("offers")}
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${
                pathRoute("/offers") && "text-black border-b-red-600"
              }`}
            >
              Offers
            </li>
            <li
              onClick={() => navigate("profile")}
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${
                (pathRoute("/sign-in") || pathRoute("/profile")) &&
                "text-black border-b-red-500"
              }`}
            >
              {page}
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
};
export default Header;
