import React, { useEffect, useState } from "react";
import API, { getPopularMatches } from "../api/api";
import { useNavigate } from "react-router-dom";

const PopularNow = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getDateLabel = (timestamp) => {
    const matchDate = new Date(timestamp);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (
      matchDate >= today &&
      matchDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
    ) {
      return "Today";
    } else if (
      matchDate >= tomorrow &&
      matchDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)
    ) {
      return "Tomorrow";
    } else {
      return matchDate.toLocaleDateString();
    }
  };

  const groupedMatches = matches.reduce((acc, match) => {
    const dateKey = getDateLabel(match.date);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(match);
    return acc;
  }, {});

  useEffect(() => {
    const fetchPopularMatches = async () => {
      try {
        const res = await getPopularMatches();
        setMatches(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPopularMatches();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-block w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 mt-3">Loading matches...</p>
        </div>
      </div>
    );
  }

  if (!matches.length) {
    return (
      <div className="w-full py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
          No matches available right now.
        </div>
      </div>
    );
  }

  return (
    <section className="w-full py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">🔥 Popular Now</h2>
          <p className="text-gray-400 text-sm">What's trending right now</p>
        </div>

        {Object.entries(groupedMatches).map(([date, matchesGroup], dateIdx) => (
          <div key={date} className="mb-12">
            <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
              <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
              {date}
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {matchesGroup.map((match, idx) => (
                <button
                  key={match.id}
                  onClick={() =>
                    navigate(`/match/${match.id}`, {
                      state: { match, categoryId: match.category },
                    })
                  }
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${(dateIdx * 0.1 + idx * 0.05)}s both`
                  }}
                  className="group text-left focus:outline-none"
                >
                  <div className="relative mb-3 overflow-hidden rounded-lg bg-slate-800">
                    {/* Image */}
                    <img
                      src={match.poster ? `${API.defaults.baseURL}${match.poster}` : "/placeholder.png"}
                      alt={match.title}
                      className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>

                    {/* Popular badge */}
                    {match.popular && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        ★ POPULAR
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {match.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {match.category.toUpperCase()}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularNow;
