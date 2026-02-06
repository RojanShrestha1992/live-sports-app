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
      <section className="p-6 max-w-7xl mx-auto ">
        <h1 className="font-semibold text-2xl leading-tight mb-5">Sports by Category</h1>
        <Swiper
          slidesPerView={2}
          spaceBetween={20}
          pagination={{
            clickable: true,
            el: ".swiper-pagination-custom",
          }}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 5 },
            1024: { slidesPerView: 6 },
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
                  className="bg-gray-800 aspect-square text-white p-6 rounded-lg text-center text-3xl flex items-center justify-center cursor-pointer hover:bg-gray-700 transition"
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
