import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

const Offers = () => {
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(2)
        );
        const querySnap = await getDocs(q);
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetched(lastVisible);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListing(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Couldn't fetch listings");
      }
    };
    fetchListings();
  }, []);

  const onFetchMoreListing = async () => {
    try {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastFetched),
        limit(2)
      );
      const querySnap = await getDocs(q);
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetched(lastVisible);
      const listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListing((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error("Couldn't fetch listings");
    }
  };
  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-center text-3xl font-sans mt-6 font-bold mb-5">
        Offers
      </h1>
      {loading ? (
        <Spinner />
      ) : listing && listing.length > 0 ? (
        <>
          <main>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {listing.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </main>
          {lastFetched && (
            <div className="flex items-center justify-center">
              <button
                onClick={onFetchMoreListing}
                className="bg-slate-200 hover:bg-slate-300 px-3 py-1.5 rounded mb-6 mt-6 hover:border-slate-600 transition duration-150 ease-in-out text-gray-700 border-gray-100"
              >
                Load more
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center font-bold mt-6">
          There are no offers currently
        </p>
      )}
    </div>
  );
};
export default Offers;
