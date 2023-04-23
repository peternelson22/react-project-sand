import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaBath, FaShare, FaMapMarkerAlt, FaBed, FaParking, FaChair } from "react-icons/fa";
import SwiperCore, {
  Autoplay,
  EffectFade,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css/bundle";

const Listing = () => {
  const params = useParams();
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopy, setShareLinkCopy] = useState(false);
  SwiperCore.use([Autoplay, Navigation, Pagination]);

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  if (loading) {
    return <Spinner />;
  }
  return (
    <main>
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[EffectFade]}
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-[300px] object-contain"
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        title="copy"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopy(true);
          setTimeout(() => {
            setShareLinkCopy(false);
          }, 2000);
        }}
        className="fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center"
      >
        <FaShare className="text-lg text-slate-500" />
      </div>
      {shareLinkCopy && (
        <p className="fixed top-[23%] right-[5%] z-10 p-2 font-semibold border-2 border-gray-400 rounded-md bg-white">
          Link copied
        </p>
      )}
      <div className="lg:mx-auto mx-auto bg-white">
        <div className="h-[300px] lg:h-[500] mt-3 bg-slate-100 rounded shadow-sm mb-6">
          <div className="grid place-items-center px-3">
            <p className="text-2xl font-bold mb-1 mt-5 text-blue-800 sm:text-sm lg:text-2xl md:text-2xl">
              {listing.name} - $
              {listing.offer
                ? listing.discountedPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : listing.regularPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              {listing.type === "rent" ? " / month" : ""}
            </p>
            <p className="flex items-center mb-3 font-semibold">
              <FaMapMarkerAlt className="text-green-700 mr-1" />
              {listing.address}
            </p>
            <div className="flex justify-center items-center space-x-4 w-[75%]">
              <p className="bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="w-full max-w-[200px] bg-green-800 rounded-md p-1 text-white text-center font-semibold shadow-md">
                  ${listing.regularPrice - listing.discountedPrice} discount
                </p>
              )}
            </div>
            <p className="mt-3 mb-2">
              <span className="font-semibold">Description: </span>{" "}
              {listing.description}
            </p>
            <div className="lg:flex lg:justify-center lg:items-start lg:space-x-5 md:flex md:justify-center md:items-start md:space-x-5 ">
              <ul className="flex justify-start items-center space-x-6  mt-3 font-semibold text-sm">
                <li className="flex items-center whitespace-nowrap">
                  <FaBed className="mr-1 text-lg" />
                  {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
                </li>
                <li className="flex items-center whitespace-nowrap">
                  <FaBath className="mr-1 text-lg" />
                  {+listing.bathrooms > 1
                    ? `${listing.bathrooms} Baths`
                    : "1 Bath"}
                </li>
              </ul>
              <ul className="flex justify-start items-start space-x-6 mt-3 font-semibold text-sm">
                <li className="flex items-center whitespace-nowrap">
                  <FaParking className="mr-1 text-lg" />
                  {listing.parking ? "Parking Spot" : "No Parking"}
                </li>
                <li className="flex items-center whitespace-nowrap">
                  <FaChair className="mr-1 text-lg" />
                  {listing.furnished ? "Furnished" : "Not Furnished"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default Listing;
