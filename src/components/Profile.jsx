import { useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;
  const navigate = useNavigate();

  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };

  return (
    <>
      <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <h1 className="font-mono text-3xl text-center mt-5 font-bold">
          My Profile
        </h1>
        <div className="w-full md:w-[50%] mt-6 px-3">
          <form>
            <input
              type="text"
              id="name"
              value={name}
              disabled
              className="w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"
            />
            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"
            />
            <div className="flex justify-between whitespace-nowrap text-sm mb-6">
              <p className="flex items-center ">
                Do you want to change your name?{" "}
                <span className="text-red-600 hover:text-red-800 transition ease-in-out duration-200 ml-1 cursor-pointer">
                  Edit
                </span>
              </p>
              <p
                onClick={onLogout}
                className="text-blue-600 hover:text-blue-800 cursor-pointer transition ease-in-out duration-200"
              >
                Sign out
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};
export default Profile;
