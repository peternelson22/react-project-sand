import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { auth, db } from "../firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const navigate = useNavigate()

  const onGooGleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/")
    } catch (error) {
      toast.error("Couldn't authorize with Google");
    }
  };
  return (
    <button
      onClick={onGooGleClick}
      type="button"
      className="flex items-center justify-center w-full bg-red-700 text-white px-7 py-2 uppercase text-sm font-medium hover:bg-red-800 active:bg-red-900 rounded shadow-md hover:shadow-lg active:shadow-lg transition duration-200 ease-in-out"
    >
      {" "}
      <FcGoogle className="text-2xl bg-white rounded-full mr-2" /> Continue with
      google
    </button>
  );
};
export default OAuth;
