import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  Pagination,
  Autoplay,
  Navigation,
  EffectFade,
} from "swiper";
import "swiper/css/bundle";
import Spinner from "../components/Spinner";

const Slider = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  SwiperCore.use([Autoplay, Navigation, Pagination]);

  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(3));
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    };
    fetchListings();
  }, []);
  if (loading) {
    return <Spinner />;
  }
  if (listings.length === 0) {
    return <></>;
  }
  return (
    listings && (
      <>
        <Swiper
          slidesPerView={1}
          pagination={{ type: "progressbar" }}
          navigation
          effect="fade"
          modules={[EffectFade]}
          autoplay={{ delay: 3000 }}
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div
                style={{
                  background: `url(${data.imgUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="w-full h-[300px] overflow-hidden cursor-pointer relative"
              ></div>
              <p className="text-[#f1faee] top-3 left-1 absolute font-medium max-w-[90%] bg-[#457b9d] opacity-90 shadow-lg p-2 rounded-br-2xl">
                {data.name}
              </p>
              <p className="text-[#b538aa] bottom-1 left-1 absolute font-semibold max-w-[90%] bg-[#dce1e3] opacity-90 shadow-lg p-2 rounded-tr-2xl">
                ${data.discountedPrice ?? data.regularPrice}
                {data.type == "rent" && " / month"}
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
};

export default Slider;
