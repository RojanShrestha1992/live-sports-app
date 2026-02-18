import React, { useContext } from "react";
import { CategoryContext } from "../context/CategoryContext";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const { categories, loading } = useContext(CategoryContext);
  const navigate = useNavigate();

  return (
    <section className="w-full  py-8 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Browse Categories</h2>
          <p className="text-gray-400 text-sm">Choose your favorite sport</p>
        </div>
    <div  className="relative pb-6">
        <Swiper
          slidesPerView={2}
          spaceBetween={12}
          pagination={{ clickable: true, }}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
          modules={[Pagination]}
          className="w-full category-swiper pb-12!"
        >
          {loading ? (
            <div className="text-gray-400">Loading categories...</div>
          ) : (
            categories.map((category, index) => (
              <SwiperSlide key={category.id}>
                <button
                  onClick={() => navigate(`/category/${category.id}`)}
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.08}s both`
                  }}
                  className="w-full h-full group bg-linear-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-slate-700 hover:border-blue-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20 flex items-center justify-center aspect-square"
                >
                  <span className="text-center font-semibold text-white group-hover:text-blue-400 transition-colors text-sm sm:text-base">
                    {category.name}
                  </span>
                </button>
              </SwiperSlide>
            ))
          )}
        </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Category;
