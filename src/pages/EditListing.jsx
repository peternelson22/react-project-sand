import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { auth, db } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

const EditListing = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState([]);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
  });
  const {
    type,
    name,
    bathrooms,
    bedrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
    images,
  } = formData;

  useEffect(() => {
    setLoading(true);
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setFormData({ ...docSnap.data() });
        setLoading(false);
      } else {
        navigate("/");
        toast.error("Listing does not exist");
      }
    };
    fetchListing();
  }, [navigate, params.listingId]);

  const onChange = (e) => {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error("Discount needs to be less than regular price");
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error("Max of 6 images are allowed");
      return;
    }
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };
    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    const docRef = doc(db, "listings", params.listingId);
    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success("Listing updated");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  if (loading) {
    return <Spinner />;
  }
  return (
    <main className="max-w-md px-2 mx-auto">
      {listing.userRef === auth.currentUser.uid ? (
        <>
          <h1 className="text-3xl text-center mt-6 font-bold">Edit Listing</h1>
          <form onSubmit={onSubmit}>
            <p className="text-lg mt-6 font-semibold">Sell / Rent</p>
            <div className="flex">
              <button
                onClick={onChange}
                type="button"
                id="type"
                value="sale"
                className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                  type === "rent"
                    ? "bg-white text-black"
                    : "bg-slate-600 text-white"
                }`}
              >
                Sell
              </button>
              <button
                onClick={onChange}
                type="button"
                id="type"
                value="rent"
                className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                  type === "sale"
                    ? "bg-white text-black"
                    : "bg-slate-600 text-white"
                }`}
              >
                Rent
              </button>
            </div>
            <p className="text-lg mt-6 font-semibold">Name</p>
            <input
              onChange={onChange}
              type="text"
              id="name"
              value={name}
              placeholder="Name"
              maxLength="32"
              minLength="10"
              required
              className="w-full rounded px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
            />
            <div className="flex space-x-6 mb-6">
              <div>
                <p className="text-lg font-semibold">Beds</p>
                <input
                  onChange={onChange}
                  type="number"
                  id="bedrooms"
                  value={bedrooms}
                  min="1"
                  max="40"
                  required
                  className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
                />
              </div>
              <div>
                <p className="text-lg font-semibold">Baths</p>
                <input
                  onChange={onChange}
                  type="number"
                  id="bathrooms"
                  value={bathrooms}
                  min="1"
                  max="40"
                  required
                  className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
                />
              </div>
            </div>
            <p className="text-lg mt-6 font-semibold">Parking Spot</p>
            <div className="flex">
              <button
                onClick={onChange}
                type="button"
                id="parking"
                value={true}
                className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                  !parking ? "bg-white text-black" : "bg-slate-600 text-white"
                }`}
              >
                Yes
              </button>
              <button
                onClick={onChange}
                type="button"
                id="parking"
                value={false}
                className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                  parking ? "bg-white text-black" : "bg-slate-600 text-white"
                }`}
              >
                No
              </button>
            </div>
            <p className="text-lg mt-6 font-semibold">Furnished</p>
            <div className="flex">
              <button
                onClick={onChange}
                type="button"
                id="furnished"
                value={true}
                className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                  !furnished ? "bg-white text-black" : "bg-slate-600 text-white"
                }`}
              >
                Yes
              </button>
              <button
                onClick={onChange}
                type="button"
                id="furnished"
                value={false}
                className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                  furnished ? "bg-white text-black" : "bg-slate-600 text-white"
                }`}
              >
                No
              </button>
            </div>
            <p className="text-lg mt-6 font-semibold">Address</p>
            <textarea
              onChange={onChange}
              type="text"
              id="address"
              value={address}
              placeholder="Address"
              required
              className="w-full rounded px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
            />
            <p className="text-lg font-semibold">Description</p>
            <textarea
              onChange={onChange}
              type="text"
              id="description"
              value={description}
              placeholder="Description"
              required
              className="w-full rounded px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
            />
            <p className="text-lg font-semibold">Offer</p>
            <div className="flex mb-6">
              <button
                onClick={onChange}
                type="button"
                id="offer"
                value={true}
                className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                  !offer ? "bg-white text-black" : "bg-slate-600 text-white"
                }`}
              >
                Yes
              </button>
              <button
                onClick={onChange}
                type="button"
                id="offer"
                value={false}
                className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                  offer ? "bg-white text-black" : "bg-slate-600 text-white"
                }`}
              >
                No
              </button>
            </div>
            <div className="flex items-center mb-6">
              <div>
                <p className="text-lg font-semibold">Regular price</p>
                <div className="flex w-full items-center justify-center space-x-6">
                  <input
                    onChange={onChange}
                    type="number"
                    id="regularPrice"
                    value={regularPrice}
                    min="50"
                    max="400000000"
                    required
                    className="w-full rounded px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
                  />
                  {type === "rent" && (
                    <div>
                      <p className="text-md w-full whitespace-nowrap">
                        $ / Month
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {offer && (
              <div className="flex items-center mb-6">
                <div>
                  <p className="text-lg font-semibold">Discounted price</p>
                  <div className="flex w-full items-center justify-center space-x-6">
                    <input
                      onChange={onChange}
                      type="number"
                      id="discountedPrice"
                      value={discountedPrice}
                      min="50"
                      max="400000000"
                      required={offer}
                      className="w-full rounded px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
                    />
                    {type === "rent" && (
                      <div>
                        <p className="text-md w-full whitespace-nowrap">
                          $ / Month
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className="mb-6">
              <p className="text-lg font-semibold">Images</p>
              <p className="text-gray-600 text-sm">
                First image will be the cover (max 6) and (max 2MB) size
                per/image
              </p>
              <input
                onChange={onChange}
                type="file"
                id="images"
                accept=".jpg,.png,.jpeg"
                multiple
                required
                className="w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600"
              />
              <button
                type="submit"
                className="mb-6 w-full px-7 py-3 bg-blue-600 text-white mt-6 font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                Edit Listing
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="grid place-items-center mx-auto mt-[40%] mb-[60%] motion-safe:animate-bounce rounded-2xl p-[75px] bg-slate-100 text-red-500">
          <p className="text-black text-2xl font-semibold italic">Page Not Found</p>
          <h1 className=" text-5xl md:text-8xl animate-pulse translate-x-3">404</h1>
        </div>
      )}
    </main>
  );
};
export default EditListing;
