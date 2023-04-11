import { useState } from "react";
import logo from "../assets/undraw_welcome_cats_thqn.svg";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "./OAuth";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      updateProfile(auth.currentUser, {
        displayName: name,
      });
      const user = userCredential.user;
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);
      toast.success("Successfull Registration");

      navigate("/");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold font-serif">
        Sign Up
      </h1>
      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
        <div className=" md:w-[67%] lg:w-[50%] mb-12 md:mb-6 md:mt-8 lg:mt-10">
          <img className="w-full rounded" src={logo} alt="sign-in" />
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form onSubmit={onSubmit}>
            <input
              className="tracking-wide mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
              type="text"
              value={name}
              id="name"
              onChange={onChange}
              placeholder="Name"
            />
            <input
              className="tracking-wide mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
              type="email"
              value={email}
              id="email"
              onChange={onChange}
              placeholder="Email address"
            />
            <div className="relative mb-6">
              <input
                className="tracking-wider w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
                type={showPassword ? "text" : "password"}
                value={password}
                id="password"
                onChange={onChange}
                placeholder="Password"
              />
              {showPassword ? (
                <AiFillEyeInvisible
                  onClick={() => setShowPassword(false)}
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                />
              ) : (
                <AiFillEye
                  onClick={() => setShowPassword(true)}
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                />
              )}
            </div>
            <div className="flex justify-between md:whitespace-nowrap text-sm sm:text-md">
              <p className="mb-4 sm:flex-1">
                Already have an account?{" "}
                <Link
                  to="/sign-in"
                  className="text-red-500 hover:text-red-800 transition duration-200 ease-in-out font-semibold"
                >
                  Login
                </Link>
              </p>

              <p className="whitespace-nowrap items-center">
                <Link
                  to="/forgot-password"
                  className="text-blue-500 hover:text-blue-800 items-center transition duration-200 ease-in-out font-semibold"
                >
                  Forgot Password?
                </Link>
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-7 py-2 text-sm uppercase font-medium rounded shadow-md hover:bg-blue-900 transition duration-200 ease-in-out hover:shadow-lg active:bg-blue-950"
            >
              Sign Up
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
export default SignUp;
