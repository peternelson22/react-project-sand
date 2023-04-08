import { FcGoogle } from "react-icons/fc";
const OAuth = () => {
  return (
    <button className="flex items-center justify-center w-full bg-red-700 text-white px-7 py-2 uppercase text-sm font-medium hover:bg-red-800 active:bg-red-900 rounded shadow-md hover:shadow-lg active:shadow-lg transition duration-200 ease-in-out">
      {" "}
      <FcGoogle className="text-2xl bg-white rounded-full mr-2" /> Continue with google
    </button>
  );
};
export default OAuth;
