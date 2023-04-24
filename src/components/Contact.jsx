import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { toast } from "react-toastify";

const Contact = ({ userRef, listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchLandlord = async () => {
      const docRef = doc(db, "users", userRef);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error("Could not get landlord data");
      }
    };
    fetchLandlord();
  }, [userRef]);

  return (
    <>
      {landlord !== null && (
        <div className="flex flex-col w-[330px] md:w-[410px]">
          <p className="mt-3 font-medium text-center">
            Contact {landlord.name} for the {listing.name.toLowerCase()}
          </p>
          <div className="">
            <textarea
              name="message"
              id="message"
              rows="2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full mt-3 mb-3 py-2 px-4 text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out text-xl focus:border-slate-600 focus:text-gray-700 focus:bg-white"
            ></textarea>
          </div>
          <a
            href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}
          >
            <button type="button" className="px-7 py-3 mb-6 text-white bg-blue-600 rounded uppercase shadow-md text-sm hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 transition duration-150 ease-in-out text-center w-full">Send message</button>
          </a>
        </div>
      )}
    </>
  );
};
export default Contact;
