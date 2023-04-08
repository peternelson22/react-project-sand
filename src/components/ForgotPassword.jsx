import { useState } from "react";
import logo from "../assets/undraw_welcome_cats_thqn.svg";
import { Link } from "react-router-dom";
import OAuth from "./OAuth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold font-serif">
        Forgot Password
      </h1>
      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
        <div className=" md:w-[67%] lg:w-[50%] mb-12 md:mb-6 md:mt-8 lg:mt-10">
          <img className="w-full rounded" src={logo} alt="sign-in" />
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form>
            <input
              className="tracking-wide mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
            />
            <div className="relative mb-2">
            </div>
            <div className="flex justify-between whitespace-nowrap text-sm">
              <p className="mb-6">
                Don't have an account?{" "}
                <Link
                  to="/sign-up"
                  className="text-red-500 hover:text-red-800 transition duration-200 ease-in-out font-semibold"
                >
                  Register
                </Link>
              </p>
              
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-7 py-2 text-sm uppercase font-medium rounded shadow-md hover:bg-blue-900 transition duration-200 ease-in-out hover:shadow-lg active:bg-blue-950"
            >
              Send reset password
            </button>
            <div className="flex items-center my-4 before:border-t  before:flex-1  before:border-gray-300 after:border-t after:flex-1 after:border-gray-300">
              <p className="uppercase text-center font-semibold mx-4">or</p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
};
export default ForgotPassword;
