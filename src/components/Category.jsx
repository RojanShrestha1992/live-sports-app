import React, { useContext } from "react";
import { CategoryContext } from "../context/CategoryContext";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import { Grid, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const { categories, loading } = useContext(CategoryContext);

  const navigate = useNavigate();
  return (
    <>
      <section className="p-6 max-w-7xl mx-auto">
        <Swiper
          slidesPerView={2}
          spaceBetween={20}
          pagination={{
            clickable: true,
            el: ".swiper-pagination-custom",
          }}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {loading ? (
            <p>Loading...</p>
          ) : (
            categories.map((category) => (
              <SwiperSlide key={category.id}>
                {" "}
                <div
                  className="bg-gray-800 aspect-square text-white p-6 rounded-lg text-center flex items-center justify-center cursor-pointer hover:bg-red-600 transition"
                  onClick={() => navigate(`/category/${category.id}`)}
                >
                  {category.name}
                </div>
              </SwiperSlide>
            ))
          )}
          <div className="swiper-pagination-custom mt-4 flex justify-center"></div>
        </Swiper>
      </section>
    </>
  );
};

export default Category;
